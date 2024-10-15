import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TBookingList, TServiceItem } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAdminBooking = () => {
    const navigate = useNavigate();
    const { isLoggedIn, selectedCenter } = useUserContext();
    const { HandleGetRequest } = useAxioRequests();
    
    const [loading, setLoading] = useState({apiData: true, bookingList: true});
    const [modalToggle, setModalToggle] = useState(false);
    const [modalData, setModalData] = useState({
        title: '',
        id: '',
    });

    
    const [selectedService, setSelectedService] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [apiData, setAPIData] = useState([] as TServiceItem[])
    const [bookingList, setBookingList] = useState<TBookingList[]>([] as TBookingList[]);
    const [filteredList, setFilteredList] = useState<TBookingList[]>([] as TBookingList[]);

    useLayoutEffect(() => {
        if(!isLoggedIn) navigate('../auth/sign-in')
    }, [isLoggedIn])

    useEffect(() => {
        loading.apiData && handleGetQueryRequest(ROUTES.getAPIBooking, 'apiData')
        if(loading.bookingList && selectedCenter) handleGetQueryRequest(`${ROUTES.commonBookingRoute}/${selectedCenter}`, 'bookingList')
    }, [loading.apiData, loading.bookingList, selectedCenter])

    // Filter the Service List Items
    useEffect(() => {
        if(bookingList?.length > 0){
            let tempList = bookingList;
            if(searchTerm !== '') tempList = tempList.filter(booking => booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

            if(selectedService !== '') tempList = tempList.filter(booking => booking.serviceID.toString().toLowerCase() === selectedService.toString().toLowerCase())
            startTransition(() => {
                setFilteredList(tempList)
            })
        }

    }, [searchTerm, selectedService, bookingList])

    // Handle Get Requests
    async function handleGetQueryRequest(route: string, mode: string) {
        const response = await HandleGetRequest({ route: route });
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({ ...prev, [mode]: false }));
    
                if (mode === 'apiData') {
                    setAPIData(response.data);
                } else {
                    const tempBookingList: TBookingList[] = response.data;
                    const sortedData = tempBookingList.sort((a, b) => {
                        const dateA = new Date(a.createdAt);
                        const dateB = new Date(b.createdAt);
                        return dateB.getTime() - dateA.getTime();
                    });
    
                    console.log(sortedData)
                    setBookingList(sortedData);
                }
            });
        }
    }
    

    // Handle Confirmation
    function handleConfirmation(){
        startTransition(() => {
            setLoading(prev => ({...prev, bookingList: true}));
        })
    }
    

    return {
        apiData,
        modalToggle,
        setModalToggle,
        selectedService,
        setSelectedService,
        searchTerm, 
        setSearchTerm,
        modalData, 
        setModalData,
        filteredList,     
        handleConfirmation, 
    }
}

export default useAdminBooking