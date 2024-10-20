import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TPartnerList } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useUserPanel = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useUserContext();
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalToggle, setModalToggle] = useState(false)


    const [partnerList, setPartnerList] = useState<TPartnerList[]>([] as TPartnerList[]);
    const [filteredList, setFilteredList] = useState<TPartnerList[]>([] as TPartnerList[]);
  
    useLayoutEffect(() => {
        if(!isLoggedIn) navigate('../auth/sign-in')
    }, [isLoggedIn])

    useEffect(() => {
        loading && handleGetQueryRequest(ROUTES.commonUserRoute)
    }, [loading])

    // Filter the Service List Items
    useEffect(() => {
        let tempList = partnerList;

        if(partnerList?.length > 0){
            if(searchTerm !== '') tempList = tempList.filter(user => user.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) || user.partnerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        startTransition(() => setFilteredList(tempList))
    }, [searchTerm, partnerList])

    // Handle Get Requests
    async function handleGetQueryRequest(route: string) {
        const response = await HandleGetRequest({ route: route });
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(false);
                setPartnerList(response.data)
            });
        }
    }

    // Handle Confirmation
    function handleConfirmation(){
        startTransition(() => {
            setLoading(false)
            setModalToggle(false)
        })
    }
    

    // Handle User Deletion
    async function handleUserDeletion(userID: string){
        const response = await HandlePostRequest({
            data: { userID: userID },
            route: `${ROUTES.commonUserRoute}/${userID}`,
            type: 'delete',
            toastDescription: 'User has deleted successfully'
        })
        if(response?.status === 200) handleConfirmation();
    } 

    return {
        filteredList,
        searchTerm,
        modalToggle, 
        setModalToggle,
        setSearchTerm,     
        handleUserDeletion,
    }
}

export default useUserPanel