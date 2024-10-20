import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TCenterList } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


type TCenterOBJ = {
    centerList: TCenterList[],
    unListedCenterList: TCenterList[]
}

const useCenterPanel = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useUserContext();
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();

    const [loading, setLoading] = useState(true);
    const [modalToggle, setModalToggle] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [centerOBJ, setCenterOBJ] = useState<TCenterOBJ>({} as TCenterOBJ);
    const [filteredOBJ, setFilteredOBJ] = useState<TCenterOBJ>({} as TCenterOBJ);

    useLayoutEffect(() => {
        if(!isLoggedIn) navigate('../auth/sign-in')
    }, [isLoggedIn])

    useEffect(() => {
        if(loading) handleGetQueryRequest(ROUTES.commonCenterRoute)
    }, [loading])

    // Filter the Center List Items
    useEffect(() => {
        const tempCenterOBJ = {
            listedList: centerOBJ.centerList,
            unListedList: centerOBJ.unListedCenterList,
        }

        if(centerOBJ.centerList?.length > 0 && searchTerm !== '') tempCenterOBJ.listedList = filteredCenterList(tempCenterOBJ.listedList)
        if(centerOBJ.unListedCenterList?.length > 0 && searchTerm !== '') tempCenterOBJ.unListedList = filteredCenterList(tempCenterOBJ.unListedList)

        function filteredCenterList(list: TCenterList[]){
            const filteredList = list.filter(center => center.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) || center.centerName.toLowerCase().includes(searchTerm.toLowerCase()) || center.centerEmail && center.centerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
            return filteredList;
        }

        startTransition(() => {
            setFilteredOBJ({
                centerList: tempCenterOBJ.listedList,
                unListedCenterList: tempCenterOBJ.unListedList
            })
        })

    }, [searchTerm, centerOBJ])

    // Handle Get Requests
    async function handleGetQueryRequest(route: string) {
        const response = await HandleGetRequest({ route: route });
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(false);
                setCenterOBJ(response.data)
            });
        }
    }
    

    // Handle Confirmation
    function handleConfirmation(){
        startTransition(() => {
            setModalToggle(false)
            setLoading(true);
        })
    }
    

    // Handle Booking Deletion
    async function handleCenterDeletion(centerID: string){
        const response = await HandlePostRequest({
            data: { centerID: centerID },
            route: `${ROUTES.commonCenterRoute}/${centerID}`,
            type: 'delete',
            toastDescription: 'Center has deleted successfully'
        })
        if(response?.status === 200) handleConfirmation();
    } 

    // Handle Center Active Status
    async function handleCenterActiveStatus(centerID: string){
        const response = await HandlePostRequest({
            data: { centerID: centerID },
            route: `${ROUTES.commonCenterRoute}/${centerID}`,
            type: 'put',
            toastDescription: 'Center Status has updated successfully'
        })
        if(response?.status === 200) handleConfirmation();
    } 


    // Handle Center Listing Status
    async function handleCenterListingStatus(centerID: string){
        const response = await HandlePostRequest({
            data: { centerID: centerID },
            route: `${ROUTES.commonCenterRoute}/${centerID}`,
            type: 'post',
            toastDescription: 'Listing has updated successfully'
        })
        if(response?.status === 200) handleConfirmation();
    } 

    return {
        modalToggle,
        setModalToggle,
        searchTerm, 
        setSearchTerm,
        filteredOBJ,     
        handleCenterDeletion,
        handleCenterActiveStatus,
        handleCenterListingStatus
    }
}

export default useCenterPanel