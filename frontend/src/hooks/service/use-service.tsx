import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TService } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useService = () => {
    const { selectedCenter } = useUserContext();
    const navigate = useNavigate();
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();
    const [loading, setLoading] = useState(true);
    
    const [modalToggle, setModalToggle] = useState(false);
    const [modalData, setModalData] = useState({
        title: '',
        id: '',
    });

    
    const [selectedSort, setSelectedSort] = useState('ascending');
    const [searchTerm, setSearchTerm] = useState('');

    const [serviceList, setServiceList] = useState<TService[]>([] as TService[]);
    const [filteredList, setFilteredList] = useState<TService[]>([] as TService[]);

    useLayoutEffect(() => {
        if(!selectedCenter){
            navigate('../center')
        }
    }, [selectedCenter])

    useEffect(() => {
        loading && handleGetQueryRequest(`${ROUTES.getServiceList}/${selectedCenter}`)
    }, [loading, selectedCenter])

    // Filter the Service List Items
    useEffect(() => {
        if(serviceList?.length > 0){
            let tempList = serviceList.sort((a, b) => selectedSort === 'ascending' ? a.serviceName?.localeCompare(b.serviceName) : b.serviceName.localeCompare(a.serviceName))

            if(searchTerm !== ''){
                tempList = tempList.filter(center => center.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
            }

            startTransition(() => {
                setFilteredList(tempList)
            })
        }

    }, [selectedSort, searchTerm, serviceList])

    // Handle Get Requests
    async function handleGetQueryRequest(route: string){
        const response = await HandleGetRequest({ route: route });
        if(response?.status === 200){
            startTransition(() => {
                setServiceList(response.data);
                setLoading(false);
            })
        }
    }

    // Handle Service Activation / InActivation 
    async function handleServiceStatusUpdate(serviceID: string, value: boolean){
        const response = await HandlePostRequest({ 
            route: `${ROUTES.commonServiceRoute}/${serviceID}`,
            data: {serviceID: serviceID, value: value},
            toastDescription: `Service has ${value ? 'activated' : 'de-activated'} successfully`,
            type: 'put'
        });
        if(response?.status === 200) handleConfirmation()
    }

    // Handle Service Deletion
    async function handleServiceDeletion(serviceID: string){
        const response = await HandlePostRequest({ 
            route: `${ROUTES.commonServiceRoute}/${serviceID}`,
            data: {serviceID: serviceID},
            toastDescription: `Service has deleted successfully`,
            type: 'delete'
        });
        if(response?.status === 200) {
            window.location.reload();
        }
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
        handleServiceStatusUpdate,
        handleServiceDeletion,
    }
}

export default useService