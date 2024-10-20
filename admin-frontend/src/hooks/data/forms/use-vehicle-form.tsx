import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TDefaultValues = {
    id: string;
    name: string;
}

const useVehicleForm = (formID = '') => {
    const navigate = useNavigate();
    const { isLoggedIn } = useUserContext();
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();

    const [loading, setLoading] = useState(true);
    const [defaultValues, setDefaultValues] = useState<TDefaultValues>({
        id: formID ?? '',
        name: '',
    })

    useLayoutEffect(() => {
        if(!isLoggedIn) navigate('../auth/sign-in')
    }, [isLoggedIn])

    useEffect(() => {
        (loading && formID !== '') && handleGetQueryRequest(`${ROUTES.commonVehicleRoute}/${formID}`)
    }, [loading, formID])

    
    // Handle Get Requests
    async function handleGetQueryRequest(route: string){
        const response = await HandleGetRequest({ route: route });
        if(response?.status === 200){
            startTransition(() => {
                setLoading(false);
                setDefaultValues(prev => ({...prev, ...response.data}))
            })
        }
    }

    // Handle Form Submission
    async function handleFormSubmission(data: Record<string, any>, handleConfirmation: () => void){
        const response = await HandlePostRequest({
            data: data,
            route: ROUTES.commonVehicleRoute, 
            type: formID === '' ? 'post' : 'put', 
            toastDescription: `Vehicle has ${formID === '' ? 'created' : 'updated'} successfully!`,
        });
        if (response?.status === 200) {
            handleConfirmation()
        }
    }
    

    return {
        defaultValues,
        handleFormSubmission,
    }
}

export default useVehicleForm