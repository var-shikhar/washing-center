import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { useLoader } from '@/context/loaderContext';

type TAxioRequestType = {
    route: string;
}

type TAxioPostRequestType = TAxioRequestType & {
    type: 'post' | 'put' | 'delete';
    data: any;
    toastDescription: string | 'Data Submitted';
}

const useAxioRequests = () => {
    const { setLoading } = useLoader()
    const HandlePostRequest = async ({
        route, type, data, toastDescription,
    }: TAxioPostRequestType) => {
      
        try {
            setLoading(true)
            let response;
            const config = { withCredentials: true };
    
            switch (type) {
                case 'post':
                    response = await axios.post(route, data, config);
                    break;
                case 'put':
                    response = await axios.put(route, data, config);
                    break;
                case 'delete':
                    response = await axios.delete(route, { data, ...config });
                    break;
                default:
                    response = await axios.post(route, data, config);
                    break;
            }
    
            if (response?.status === 200) {
                toast({
                    title: 'Success',
                    description: toastDescription
                })
            } else {
                toast({
                    title: 'Error',
                    description: response?.data?.message
                })
            }
            return response;
        } catch (err) {
            const errorMessage = (err as any).response?.data?.message || "An error occurred";
            console.error(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage
            })
        } finally {
            setLoading(false);
        }
    };

    
    const HandleGetRequest = async ({route}: TAxioRequestType) => {
        try {
            setLoading(true)
            const response = await axios.get(route, { withCredentials: true });
            if (response?.status !== 200) {
                toast({
                    title: 'Success',
                    description: response?.data?.message
                })
            }
            return response;
        } catch (err) {
            const errorMessage = (err as any).response?.data?.message || "An error occurred";
            console.error(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage
            })
        } finally {
            setLoading(false)
        }
    }

    return {
        HandlePostRequest,
        HandleGetRequest
    }
}

export default useAxioRequests