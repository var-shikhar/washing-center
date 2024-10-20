import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TServiceList } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useServicePanel = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useUserContext();
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalToggle, setModalToggle] = useState(false)

    const [serviceList, setServiceList] = useState<TServiceList[]>([] as TServiceList[]);
    const [filteredList, setFilteredList] = useState<TServiceList[]>([] as TServiceList[]);
  
    useLayoutEffect(() => {
        if(!isLoggedIn) navigate('../auth/sign-in')
    }, [isLoggedIn])

    useEffect(() => {
        loading && handleGetQueryRequest(ROUTES.commonServiceRoute)
    }, [loading])

    // Filter the Service List Items
    useEffect(() => {
        let tempList = serviceList;
        if(serviceList?.length > 0 && searchTerm !== '') tempList = tempList.filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()));

        startTransition(() => setFilteredList(tempList))
    }, [searchTerm, serviceList])

    // Handle Get Requests
    async function handleGetQueryRequest(route: string) {
        const response = await HandleGetRequest({ route: route });
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(false);
                setServiceList(response.data)
            });
        }
    }

    // Handle Confirmation
    function handleConfirmation(){
        startTransition(() => {
            setLoading(true)
            setModalToggle(false)
        })
    }

    // Handle Service Deletion
    async function handleServiceDeletion(serviceID: string){
        const response = await HandlePostRequest({
            data: { serviceID: serviceID },
            route: `${ROUTES.commonServiceRoute}/${serviceID}`,
            type: 'delete',
            toastDescription: 'Service has deleted successfully'
        })
        if(response?.status === 200) handleConfirmation();
    } 

    return {
        filteredList,
        searchTerm,
        modalToggle, 
        setModalToggle,
        setSearchTerm,     
        handleServiceDeletion,
        handleConfirmation,
    }
}

export default useServicePanel