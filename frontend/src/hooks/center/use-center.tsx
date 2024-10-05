import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useState } from 'react';

type TCenterList = {
    centerID: string;
    centerName: string;
    centerAbbreviation: string;
    centerPhone: string;
    centerAddress: string;
    centerIsActive: boolean;
}

const useCenter = () => {
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();
    const { handleCenterSelection } = useUserContext();
    const [loading, setLoading] = useState(true);
    
    const [modalToggle, setModalToggle] = useState(false);
    const [modalData, setModalData] = useState({
        title: '',
        id: '',
    });

    
    const [selectedSort, setSelectedSort] = useState('ascending');
    const [searchTerm, setSearchTerm] = useState('');

    const [centerList, setCenterList] = useState<TCenterList[]>([] as TCenterList[]);
    const [filteredList, setFilteredList] = useState<TCenterList[]>([] as TCenterList[]);

    useEffect(() => {
        loading && handleGetQueryRequest(ROUTES.commonCenterRoute)
    }, [loading])

    // Filter the Center List Items
    useEffect(() => {
        if(centerList?.length > 0){
            let tempList = centerList.sort((a, b) => selectedSort === 'ascending' ? a.centerName?.localeCompare(b.centerName) : b.centerName.localeCompare(a.centerName))

            if(searchTerm !== ''){
                tempList = tempList.filter(center => center.centerName.toLowerCase().includes(searchTerm.toLowerCase()));
            }

            startTransition(() => {
                setFilteredList(tempList)
            })
        }

    }, [selectedSort, searchTerm, centerList])

    // Handle Get Requests
    async function handleGetQueryRequest(route: string){
        const response = await HandleGetRequest({ route: route });
        if(response?.status === 200){
            startTransition(() => {
                setCenterList(response.data);
                setLoading(false);
            })
        }
    }

    // Handle Center Activation / InActivation 
    async function handleCenterStatusUpdate(centerID: string, value: boolean){
        const response = await HandlePostRequest({ 
            route: `${ROUTES.commonCenterRoute}/${centerID}`,
            data: {centerID: centerID, value: value},
            toastDescription: `Center has ${value ? 'activated' : 'de-activated'} successfully`,
            type: 'put'
        });
        if(response?.status === 200) handleConfirmation()
    }

    // Handle Center Deletion
    async function handleCenterDeletion(centerID: string){
        const response = await HandlePostRequest({ 
            route: `${ROUTES.commonCenterRoute}/${centerID}`,
            data: {centerID: centerID},
            toastDescription: `Center has deleted successfully`,
            type: 'delete'
        });
        if(response?.status === 200) handleConfirmation()
    }

    // Handle Selected Center
    async function handleCenterSelectionFunction(centerID: string){
        handleCenterSelection(centerID, true)
    }

    // Handle Confirmation
    function handleConfirmation(){
        startTransition(() => {
            setLoading(true);
        })
    }

    return {
        modalToggle,
        setModalToggle,
        selectedSort,
        setSelectedSort,
        searchTerm, 
        setSearchTerm,
        modalData, 
        setModalData,
        filteredList,     
        handleConfirmation,   
        handleCenterStatusUpdate,
        handleCenterDeletion,
        handleCenterSelectionFunction,
    }
}

export default useCenter