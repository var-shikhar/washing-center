import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TServiceCategory, TServiceVehicle } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TDefaultValues = {
    id: string;
    serviceName: string;
    categoryID: string;
    vehicleID: string;
    serviceDescription: string;
}

const useServiceForm = (formID = '') => {
    const navigate = useNavigate();
    const { isLoggedIn } = useUserContext();
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();

    const [loading, setLoading] = useState({
        initial: formID !== '',
        data: true
    });

    const [apiData, setAPIData] = useState({
        categoryList: [] as TServiceCategory[],
        vehicleList: [] as TServiceVehicle[],
    });

    const [defaultValues, setDefaultValues] = useState<TDefaultValues>({
        id: formID ?? '',
        serviceName: '',
        categoryID: '',
        vehicleID: '',
        serviceDescription: '',
    })

    useLayoutEffect(() => {
        if(!isLoggedIn) navigate('../auth/sign-in')
    }, [isLoggedIn])

    useEffect(() => {
        loading.initial && handleGetQueryRequest(`${ROUTES.commonServiceRoute}/${formID}`, 'initial')
        loading.data && handleGetQueryRequest(ROUTES.getAPIServiceRoute, 'data')
    }, [loading.data, loading.initial, formID])

    
    // Handle Get Requests
    async function handleGetQueryRequest(route: string, mode: string){
        const response = await HandleGetRequest({ route: route });
        if(response?.status === 200){
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}));
                mode === 'initial'
                    ? setDefaultValues(prev => ({...prev, ...response.data}))
                    : setAPIData(prev => ({...prev, ...response.data}))
            })
        }
    }

    // Handle Form Submission
    async function handleFormSubmission(data: Record<string, any>, handleConfirmation: () => void){
        const response = await HandlePostRequest({
            data: data,
            route: ROUTES.commonServiceRoute, 
            type: formID === '' ? 'post' : 'put', 
            toastDescription: `Service Item has ${formID === '' ? 'created' : 'updated'} successfully!`,
        });
        if (response?.status === 200) {
            handleConfirmation()
        }
    }
    

    return {
        defaultValues,
        apiData,
        handleFormSubmission,
    }
}

export default useServiceForm