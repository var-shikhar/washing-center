import { toast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TService } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useState } from 'react';

type TDefaultValues = {
    userID: string;
    userName: string;
    userPhone: string;
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

const useServiceBookingForm = ({bookedService, centerID}: {bookedService: TService, centerID: string}) => {
    const { isLoggedIn, userData, handleLoggedIn } = useUserContext();
    const { HandlePostRequest } = useAxioRequests();

    const [selectedEmail, setSelectedEmail] = useState('');
    const [selectedPhase, setSelectedPhase] = useState(isLoggedIn ? 2 : 0);

    const defaultValues: TDefaultValues = {
        userID: userData?.userID ?? '',
        userName: userData?.userName ?? '',
        userPhone: userData?.userPhone ?? '',
        bookingDate: new Date().toISOString().split('T')[0],
        bookingTime: new Date().toTimeString().split(' ')[0],
        message: 'Booking Request',
    };

    const [servicePricing, setServicePricing] = useState<TServicePricing>({
        serviceID: bookedService.id,
        centerID: centerID,
        servicePrice: bookedService.discPrice,
        serviceAddons: bookedService.addons?.map(item => {return { addonID: item.serviceID, addonPrice: item.price, addonDiscPrice: item.discPrice }}),
        isCustomizable: bookedService.isCustomizable,
        totalDiscountedPrice: bookedService.totalDiscountedPrice ?? bookedService.discPrice,
        totalPrice: bookedService.totalPrice ?? bookedService.price,
    })

    // Handle Booking Form Submission
    async function handleFormSubmission(data: Record<string, any>, handleConfirmation: (bookingID: string) => void){
        const finalData = {...data, ...servicePricing};
        const response = await HandlePostRequest({
            data: finalData,
            route: ROUTES.publicCommonServiceBooking, 
            type: 'post',
            toastDescription: `Booking has been created successfully!`,
        });
        if (response?.status === 200) {
            handleConfirmation(response?.data)
        }
    }

    // Handle Booking Form Submission
    async function handleUserAuth(){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        if (selectedEmail && emailRegex.test(selectedEmail)) {
            const response = await HandlePostRequest({
                data: { userEmail: selectedEmail },
                route: ROUTES.publicCommonEmailValidation, 
                type: 'post',
                toastDescription: `OTP has shared successfully!`,
            });
            if (response?.status === 200) {
                setSelectedPhase(1)
            }
        } else {
            toast({
                title: 'Error',
                description: 'Invalid Email'
            })
        }
    }

    // Handle Customize Service Addons
    function handleCustomizableAddons(reqAddonID: string, mode: 'add' | 'remove') {
        let tempTotalPrice = servicePricing.totalPrice;
        let tempTotalDiscountedPrice = servicePricing.totalDiscountedPrice;
        const tempAddons = [...(servicePricing.serviceAddons || [])];
    
        const addonIndex = tempAddons.findIndex(item => item.addonID.toString() === reqAddonID.toString());
    
        if (mode === 'add') {
            if (addonIndex === -1) {
                // Add the new addon from bookedService
                const newAddon = bookedService.addons.find(item => item.serviceID.toString() === reqAddonID.toString());
    
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

    // Handle OTP Confirmation
    function handleOTPConfirmation(userID: string){
        handleLoggedIn(userID)
    }

    return {
        ROUTES,
        isLoggedIn,
        defaultValues,
        selectedEmail, 
        selectedPhase,
        servicePricing,
        setSelectedPhase,
        setSelectedEmail,
        handleUserAuth,
        handleFormSubmission,
        handleCustomizableAddons,
        handleOTPConfirmation,
    }
}

export default useServiceBookingForm