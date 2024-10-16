import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TBackendBookingList, TBookingList, TServiceItem } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';


type TBookingOBJ = {
    bookingList: TBookingList[],
    backendBookingList: TBackendBookingList[]
}

const useAdminBooking = () => {
    const navigate = useNavigate();
    const { isLoggedIn, selectedCenter } = useUserContext();
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();

    const [loading, setLoading] = useState({apiData: true, bookingList: true});
    const [modalToggle, setModalToggle] = useState(false);
    const [modalData, setModalData] = useState({
        title: '',
        id: '',
    });

    
    const [selectedService, setSelectedService] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [apiData, setAPIData] = useState([] as TServiceItem[])
    const [bookingOBJ, setBookingOBJ] = useState<TBookingOBJ>({} as TBookingOBJ);
    const [filteredOBJ, setFilteredOBJ] = useState<TBookingOBJ>({} as TBookingOBJ);

    useEffect(() => {
        const socket = io(ROUTES.BACKEND_ROUTE);
        
        const refreshListener = () => {
            const audio = new Audio('/assets/notification.wav');
            audio.play().catch(error => console.log('Error playing sound:', error))
            setLoading(prev => ({ ...prev, bookingList: true }));
        };
    
        if (selectedCenter) {
            socket.emit('joinCenterRoom', selectedCenter);
            socket.on('refreshBookings', refreshListener);
        }
    
        return () => {
            socket.off('refreshBookings', refreshListener);
            socket.disconnect();
        };
    }, [selectedCenter]);
    

    useLayoutEffect(() => {
        if(!isLoggedIn) navigate('../auth/sign-in')
    }, [isLoggedIn])

    useEffect(() => {
        loading.apiData && handleGetQueryRequest(ROUTES.getAPIBooking, 'apiData')
        if(loading.bookingList && selectedCenter) handleGetQueryRequest(`${ROUTES.commonBookingRoute}/${selectedCenter}`, 'bookingList')
    }, [loading.apiData, loading.bookingList, selectedCenter])

    // Filter the Service List Items
    useEffect(() => {
        const tempBookingOBJ = {
            list: [] as TBookingList[],
            backendList: [] as TBackendBookingList[],
        }
        if(bookingOBJ.bookingList?.length > 0){
            tempBookingOBJ.list = bookingOBJ.bookingList;
            if(searchTerm !== '') tempBookingOBJ.list = tempBookingOBJ.list.filter(booking => booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || booking.id.toLowerCase().includes(searchTerm.toLowerCase()));
            if(selectedService !== '') tempBookingOBJ.list = tempBookingOBJ.list.filter(booking => booking.serviceID.toString().toLowerCase() === selectedService.toString().toLowerCase())
        }

        if(bookingOBJ.backendBookingList?.length > 0){
            tempBookingOBJ.backendList = bookingOBJ.backendBookingList;
            if(searchTerm !== '') tempBookingOBJ.backendList = tempBookingOBJ.backendList.filter(booking => booking.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) || booking.id.toLowerCase().includes(searchTerm.toLowerCase()));
            if(selectedService !== '') tempBookingOBJ.backendList = tempBookingOBJ.backendList.filter(booking => booking.serviceID.toString().toLowerCase() === selectedService.toString().toLowerCase())
        }

        startTransition(() => {
            setFilteredOBJ({
                bookingList: tempBookingOBJ.list,
                backendBookingList: tempBookingOBJ.backendList
            })
        })

    }, [searchTerm, selectedService, bookingOBJ])

    // Handle Get Requests
    async function handleGetQueryRequest(route: string, mode: string) {
        const response = await HandleGetRequest({ route: route });
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({ ...prev, [mode]: false }));
                mode === 'apiData' ? setAPIData(response.data) : setBookingOBJ(response.data)
            });
        }
    }
    

    // Handle Confirmation
    function handleConfirmation(){
        startTransition(() => {
            setLoading(prev => ({...prev, bookingList: true}));
        })
    }
    

    // Handle Booking Deletion
    async function handleBookingDeletion(bookingID: string){
        const response = await HandlePostRequest({
            data: { bookingID: bookingID },
            route: `${ROUTES.commonBookingRoute}/${bookingID}`,
            type: 'delete',
            toastDescription: 'Booking has deleted successfully'
        })
        if(response?.status === 200) handleConfirmation();
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
        filteredOBJ,     
        handleConfirmation, 
        handleBookingDeletion,
    }
}

export default useAdminBooking