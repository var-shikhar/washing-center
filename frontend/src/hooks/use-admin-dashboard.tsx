import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type TDashboardData = {
    yearlyAmount: number;
    monthlyAmount: number;
    weeklyAmount: number;
    dailyAmount: number;
    bookingList: {
        id: string;
        clientName: string;
        serviceName: string;
        serviceAmount: number;
        serviceType: string;
        abbreviation: string;
    }[]
}

const useAdminDashboard = () => {
    const navigate = useNavigate();
    const { HandleGetRequest } = useAxioRequests();
    const { isLoggedIn, selectedCenter } = useUserContext();
    const [loading, setLoading] = useState(true);

    const [dashboardData, setDashboardData] = useState<TDashboardData>({} as TDashboardData);

    // Navigate the Auth Page (if not logged-in)
    useLayoutEffect(() => {
        if(!isLoggedIn || !selectedCenter) navigate('../auth/sign-in')
    }, [isLoggedIn, selectedCenter])


    useEffect(() => {
        loading && handleGetQueryRequest(`${ROUTES.getDashboardData}/${selectedCenter}`)
    }, [loading, selectedCenter])

    // Handle Get Requests
    async function handleGetQueryRequest(route: string){
        const response = await HandleGetRequest({ route: route });
        if(response?.status === 200){
            startTransition(() => {
                setDashboardData(response.data);
                setLoading(false);
            })
        }
    }

    return {
        dashboardData
    }
}

export default useAdminDashboard