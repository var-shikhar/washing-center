import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TService } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TDefaultValues = {
    userName: string;
    userPhone: string;
    userEmail: string;
    bookingDate: string;
    bookingTime: string;
    message: string;
}

type TServicePricing = {
    serviceID: string;
    centerID: string;
    servicePrice: number;
    serviceAddons?: {
        addonID: string;
        addonPrice: number;
        addonDiscPrice: number;
    }[];
    isCustomizable: boolean;
    totalPrice: number;
    totalDiscountedPrice: number;
}

const useBackendServiceBookingForm = () => {
    const navigate = useNavigate();
    const { isLoggedIn, selectedCenter } = useUserContext();
    const { HandlePostRequest, HandleGetRequest } = useAxioRequests();

    const [loading, setLoading] = useState(true);
    const [serviceList, setServiceList] = useState<TService[]>([] as TService[]);

    const [selectedPhase, setSelectedPhase] = useState(0);
    const [selectedService, setSelectedService] = useState<TService | null>(null);

    const defaultValues: TDefaultValues = {
        userName: '',
        userEmail: '',
        userPhone: '',
        bookingDate: new Date().toISOString().split('T')[0],
        bookingTime: new Date().toTimeString().split(' ')[0],
        message: 'Backend Booking Request',
    };

    const [servicePricing, setServicePricing] = useState<TServicePricing>({
        serviceID: selectedService?.id ?? '',
        centerID: selectedCenter ?? '',
        servicePrice: selectedService?.discPrice ?? 0,
        serviceAddons: selectedService?.addons?.map(item => {return { addonID: item.serviceID, addonPrice: item.price, addonDiscPrice: item.discPrice }}) ?? [],
        isCustomizable: selectedService?.isCustomizable ?? false,
        totalDiscountedPrice: selectedService?.totalDiscountedPrice ?? selectedService?.discPrice ?? 0,
        totalPrice: selectedService?.totalPrice ?? selectedService?.price ?? 0,
    })

    useLayoutEffect(() => {
        if(!isLoggedIn || !selectedCenter) navigate('../auth/sign-in')
    }, [isLoggedIn, selectedCenter])

    useEffect(() => {
        if(loading && selectedCenter) handleGetQueryRequest(`${ROUTES.commonAdminServiceBooking}/${selectedCenter}`)
    }, [loading, selectedCenter])

    
    useEffect(() => {
        if(selectedService && selectedCenter){
            const tempServicePricing = {
                serviceID: selectedService.id,
                centerID: selectedCenter,
                servicePrice: selectedService.discPrice,
                serviceAddons: selectedService.addons?.map(item => {return { addonID: item.serviceID, addonPrice: item.price, addonDiscPrice: item.discPrice }}) ?? [],
                isCustomizable: selectedService.isCustomizable,
                totalDiscountedPrice: selectedService.totalDiscountedPrice ?? selectedService.discPrice,
                totalPrice: selectedService.totalPrice ?? selectedService.price
            }

            startTransition(() => {
                setServicePricing(tempServicePricing)
            })
        }
    }, [selectedService])


    // Handle Get Service List
    async function handleGetQueryRequest(route: string){
        const response = await HandleGetRequest({route: route});
        if(response?.status === 200){
            startTransition(() => {
                setServiceList(response.data);
                setLoading(false);
            })
        }
    }

    // Handle Booking Form Submission
    async function handleFormSubmission(data: Record<string, any>, handleConfirmation: (bookingID: string) => void){
        const finalData = {...data, ...servicePricing};
        const response = await HandlePostRequest({
            data: finalData,
            route: ROUTES.commonAdminServiceBooking, 
            type: 'post',
            toastDescription: `Booking has been created successfully!`,
        });
        if (response?.status === 200) {
            handleConfirmation(response?.data)
        }
    }

    // Handle Customize Service Addons
    function handleCustomizableAddons(reqAddonID: string, mode: 'add' | 'remove') {
        if(selectedService){
            let tempTotalPrice = servicePricing.totalPrice;
            let tempTotalDiscountedPrice = servicePricing.totalDiscountedPrice;
            const tempAddons = [...(servicePricing.serviceAddons || [])];
        
            const addonIndex = tempAddons.findIndex(item => item.addonID.toString() === reqAddonID.toString());
        
            if (mode === 'add') {
                if (addonIndex === -1) {
                    // Add the new addon from bookedService
                    const newAddon = selectedService.addons.find(item => item.serviceID.toString() === reqAddonID.toString());
        
                    if (newAddon) {
                        tempAddons.push({
                            addonID: newAddon.serviceID,
                            addonPrice: newAddon.price,
                            addonDiscPrice: newAddon.discPrice,
                        }); 
                        tempTotalDiscountedPrice += newAddon.discPrice;
                        tempTotalPrice += newAddon.price;
                    } else {
                        console.error(`Addon with ID ${reqAddonID} not found in bookedService.`);
                        return;
                    }
                } else {
                    console.log(`Addon with ID ${reqAddonID} is already added.`);
                }
            } else if (mode === 'remove') {
                if (addonIndex !== -1) {
                    tempTotalPrice -= tempAddons[addonIndex].addonPrice; 
                    tempTotalDiscountedPrice -= tempAddons[addonIndex].addonDiscPrice;
                    tempAddons.splice(addonIndex, 1); 
                } else {
                    console.error(`Addon with ID ${reqAddonID} not found for removal.`);
                    return;
                }
            }
        
            startTransition(() => {
                setServicePricing(prev => ({
                    ...prev,
                    totalPrice: tempTotalPrice,
                    totalDiscountedPrice: tempTotalDiscountedPrice,
                    serviceAddons: tempAddons
                }));
            });
        }
    }
    
    return {
        serviceList,
        selectedService,
        defaultValues,
        selectedPhase,
        servicePricing,
        setSelectedService,
        setSelectedPhase,
        handleFormSubmission,
        handleCustomizableAddons,
    }
}

export default useBackendServiceBookingForm