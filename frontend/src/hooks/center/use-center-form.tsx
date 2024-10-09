import { TLocationObj } from '@/components/googleMap';
import useAxioRequests from '@/lib/axioRequest';
import ROUTES from '@/lib/routes';
import React, { startTransition, useEffect, useState } from 'react';

type TDefaultValues = TLocationObj & {
    id: string;
    centerName: string;
    centerEmail: string;
    centerPhone: string;
    centerDOI: string;
    timing: {
        open: string;
        close: string;
    }
}

const useCenterForm = (formID = '') => {
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();
    const [loading, setLoading] = useState(formID !== '');


    const [currentPhase, setCurrentPhase] = useState(0);
    const [defaultValues, setDefaultValues] = useState<TDefaultValues>({
        id: formID,
        address: '',
        city: '',
        state: '',
        geoLocation: {
            lat: 0,
            long: 0
        },
        centerName: '',
        centerEmail: '',
        centerPhone: '',
        centerDOI: '',
        timing: {
            open: '',
            close: '',
        }
    })

    const setLocationDetail = (locationUpdate: React.SetStateAction<TLocationObj>) => {
        setDefaultValues(prev => ({
            ...prev,
            ...typeof locationUpdate === 'function' ? locationUpdate(prev) : locationUpdate
        }));
    };

    useEffect(() => {
        loading && handleGetQueryRequest(`${ROUTES.commonCenterRoute}/${formID}`)
    }, [loading, formID])

    
    // Handle Get Requests
    async function handleGetQueryRequest(route: string){
        const response = await HandleGetRequest({ route: route });
        if(response?.status === 200){
            startTransition(() => {
                setDefaultValues(prev => ({...prev, ...response.data}));
                setLoading(false);
            })
        }
    }

    // Handle Form Submission
    async function handleFormSubmission(data: Record<string, any>, handleConfirmation: () => void){
        const finalData = {
            ...data, 
            address: defaultValues.address,
            city: defaultValues.city,
            state: defaultValues.state,
            geoLocation: defaultValues.geoLocation,
        }
        const response = await HandlePostRequest({
            data: finalData,
            route: ROUTES.commonCenterRoute, 
            type: formID === '' ? 'post' : 'put', 
            toastDescription: `Center has ${formID === '' ? 'created' : 'updated'} successfully!`,
        });
        if (response?.status === 200) {
            handleConfirmation()
        }
    }

    return {
        defaultValues,
        currentPhase,
        loading, 
        setCurrentPhase,
        setDefaultValues,
        setLocationDetail,
        handleFormSubmission,

    }
}

export default useCenterForm