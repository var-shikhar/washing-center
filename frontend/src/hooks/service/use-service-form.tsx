import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TServiceCategory, TServiceItem, TServiceVehicle } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TServiceOption = {
    serviceID: string;
    price: number;
    discPrice: number;
}

type TDefaultValues = TServiceOption & {
    centerID: string;
    id?: string;
    isCustomizable: boolean;
    addons?: TServiceOption[];
}

const useServiceForm = (formID = '') => {
    const { selectedCenter } = useUserContext();
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();
    const navigate = useNavigate();
    const [loading, setLoading] = useState({
        initial: formID !== '',
        data: true
    });

    const [apiData, setAPIData] = useState({
        categoryList: [] as TServiceCategory[],
        vehicleList: [] as TServiceVehicle[],
        serviceList: [] as TServiceItem[],
        filteredServiceList: [] as TServiceItem[],
        addonServiceList: [] as TServiceItem[],
        filteredAddonServiceList: [] as TServiceItem[],
    });

    const [defaultValues, setDefaultValues] = useState<TDefaultValues>({
        centerID: selectedCenter ?? '',
        id: formID,
        serviceID: '',
        price: 0,
        discPrice: 0,
        isCustomizable: false,
        addons: []
    })

    const [selectedFilters, setSelectedFilters] = useState({
        category: '',
        vehicle: '',
    })

    useLayoutEffect(() => {
        if(!selectedCenter){
            navigate('../center')
        }
    }, [selectedCenter])

    useEffect(() => {
        loading.initial && handleGetQueryRequest(`${ROUTES.commonServiceRoute}/${formID}`, 'initial')
        loading.data && handleGetQueryRequest(ROUTES.getAPIServiceForm, 'data')
    }, [loading.data, loading.initial, formID])

    useEffect(() => {
        let tempList = apiData.serviceList;
        let tempAddonList = apiData.addonServiceList;

        if(tempList.length > 0){
            if(selectedFilters.vehicle !== ''){
                tempList = tempList.filter(item => item.vehicleID.toString() === selectedFilters.vehicle.toString())
                tempAddonList = tempAddonList.filter(item => item.vehicleID.toString() === selectedFilters.vehicle.toString())
            }

            if(selectedFilters.category !== ''){
                tempAddonList = tempAddonList.filter(item => item.categoryID.toString() === selectedFilters.category.toString())

            }

            startTransition(() => {
                setAPIData(prev => ({ ...prev, filteredServiceList: tempList, filteredAddonServiceList: tempAddonList}));
            })
        }
    }, [selectedFilters.category, selectedFilters.vehicle, apiData.serviceList, apiData.addonServiceList])
    
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
            toastDescription: `Service has ${formID === '' ? 'created' : 'updated'} successfully!`,
        });
        if (response?.status === 200) {
            handleConfirmation()
        }
    }

    // Handle Form Filter (Category and Vehicle)
    function handleFilterChange(value: string, mode: string) {
        startTransition(() => {
            setSelectedFilters(prev => ({
                ...prev,
                [mode]: value
            }));
        });
    }
    

    return {
        defaultValues,
        apiData,
        selectedFilters,
        handleFormSubmission,
        handleFilterChange,
    }
}

export default useServiceForm