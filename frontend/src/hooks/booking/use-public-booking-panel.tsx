import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TBookingList } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const usePublicBookingPanel = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useUserContext();
    const { HandleGetRequest } = useAxioRequests();
    
    const [loading, setLoading] = useState({bookingList: true});
    
    const [selectedSort, setSelectedSort] = useState('ascending');
    const [searchTerm, setSearchTerm] = useState('');

    const [bookingList, setBookingList] = useState<TBookingList[]>([] as TBookingList[]);
    const [filteredList, setFilteredList] = useState<TBookingList[]>([] as TBookingList[]);

    useLayoutEffect(() => {
        if(!isLoggedIn) navigate('../auth/sign-in')
    }, [isLoggedIn])

    useEffect(() => {
        if(loading.bookingList) handleGetQueryRequest(ROUTES.publicCommonServiceBooking, 'bookingList')
    }, [loading.bookingList])

    // Filter the Service List Items
    useEffect(() => {
        if(bookingList?.length > 0){
            let tempList = bookingList;
            if(searchTerm !== '') tempList = tempList.filter(booking => booking.id.toLowerCase().includes(searchTerm.toLowerCase()));

            startTransition(() => {
                setFilteredList(tempList)
            })
        }

    }, [selectedSort, searchTerm, bookingList])

    // Handle Get Requests
    async function handleGetQueryRequest(route: string, mode: string){
        const response = await HandleGetRequest({ route: route });
        if(response?.status === 200){
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}));
                setBookingList(response.data);
            })
        }
    }

    // Handle Confirmation
    function handleConfirmation(){
        startTransition(() => {
            setLoading(prev => ({...prev, bookingList: true}));
        })
    }
    

    return {
        selectedSort,
        setSelectedSort,
        searchTerm, 
        setSearchTerm,
        filteredList,     
        handleConfirmation, 
    }
}

export default usePublicBookingPanel