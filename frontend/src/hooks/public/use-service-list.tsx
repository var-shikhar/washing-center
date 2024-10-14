import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TCenter, TService } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useState } from 'react';


const usePublicServiceList = (centerID: string) => {
    const { HandleGetRequest } = useAxioRequests();
    const { isLoggedIn } = useUserContext();

    const [loading, setLoading] = useState(true);
    const [centerData, setCenterData] = useState<TCenter>({} as TCenter)
    const [serviceList, setServiceList] = useState<TService[]>([] as TService[]);
    const [filteredList, setFilteredList] = useState<TService[]>([] as TService[]);

    const [searchedText, setSearchedText] = useState('');
    const [dialogToggle, setDialogToggle] = useState(false);
    const [dialogData, setDialogData] = useState<TService>({} as TService);

    const [formToggle, setFormToggle] = useState(false);
    const [confirmationToggle, setConfirmationToggle] = useState(false);
    const [bookingID, setBookingID] = useState('');

    useEffect(() => {
        async function handleGetQueryRequest(route: string){
            const response = await HandleGetRequest({ route: route });
            if(response?.status === 200){
                const { centerID, centerName, centerPhone, centerEmail, centerTiming, centerAddress, centerAbbreviation, centerGeoLocation, serviceList, todaysCount } = response.data;
                startTransition(() => {
                    setLoading(false);
                    setCenterData({
                        centerID: centerID,
                        centerName: centerName,
                        centerAbbreviation: centerAbbreviation,
                        centerAddress: centerAddress,
                        centerPhone: centerPhone,
                        centerEmail: centerEmail,
                        todaysCount: todaysCount,
                        centerTiming: {
                            edTime: centerTiming.edTime,
                            stTime: centerTiming.stTime,
                        },
                        centerGeoLocation: {
                            lat: centerGeoLocation.lat,
                            long: centerGeoLocation.long
                        },
                    });
                    setServiceList(serviceList);
                })
            }
        }

        if(loading && centerID !== '') handleGetQueryRequest(`${ROUTES.publicServiceListRoute}/${centerID}`)
    }, [loading, centerID])

    useEffect(() => {
        const tempSelectedOption = sessionStorage.getItem('selectedService');
        const tempSelectedCenter = sessionStorage.getItem('selectedCenter');
    
        if(centerData.centerID){
            if(isLoggedIn && tempSelectedOption && tempSelectedCenter === centerData.centerID){
                const parsedSelectedItem = JSON.parse(tempSelectedOption);

                startTransition(() => {
                    setDialogToggle(true);
                    setDialogData(parsedSelectedItem);
                    sessionStorage.removeItem('selectedCenter')
                    sessionStorage.removeItem('selectedService')
                })
            }
        }
    }, [centerData.centerID])

    useEffect(() => {
        let tempList = serviceList;

        if(tempList?.length > 0){
            if(searchedText !== ''){
                tempList = tempList.filter(item => item.serviceName.toLowerCase().includes(searchedText.toLowerCase()));
            }
        } 
        
        startTransition(() => {
            setFilteredList(tempList)
        })
    }, [serviceList, searchedText])
  
    // Handle Booking
    function handleBookingToggle(){
        startTransition(() => {
            setDialogToggle(false)
            setFormToggle(true)
        })
    }

    // Handle Service Selection
    function handleServiceSelection(service: TService){
        startTransition(() => {
            setDialogToggle(true);
            setDialogData(service);
            sessionStorage.setItem('selectedCenter', centerData.centerID)
            sessionStorage.setItem('selectedService', JSON.stringify(service))
        })
    }

    return {
        centerData,
        filteredList,
        searchedText, 
        dialogToggle, 
        dialogData, 
        formToggle, 
        confirmationToggle, 
        bookingID, 
        setBookingID,
        setConfirmationToggle,
        setFormToggle,
        setDialogData,
        setDialogToggle,
        setSearchedText,
        handleBookingToggle,
        handleServiceSelection
    }
}

export default usePublicServiceList