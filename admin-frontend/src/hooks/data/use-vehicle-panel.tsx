import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TServiceVehicle } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useVehiclePanel = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useUserContext();
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalToggle, setModalToggle] = useState(false)

    const [vehicleList, setVehicleList] = useState<TServiceVehicle[]>([] as TServiceVehicle[]);
    const [filteredList, setFilteredList] = useState<TServiceVehicle[]>([] as TServiceVehicle[]);
  
    useLayoutEffect(() => {
        if(!isLoggedIn) navigate('../auth/sign-in')
    }, [isLoggedIn])

    useEffect(() => {
        loading && handleGetQueryRequest(ROUTES.commonVehicleRoute)
    }, [loading])

    // Filter the Vehicle List Items
    useEffect(() => {
        let tempList = vehicleList;
        if(vehicleList?.length > 0 && searchTerm !== '') tempList = tempList.filter(vehicle => vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()));

        startTransition(() => setFilteredList(tempList))
    }, [searchTerm, vehicleList])

    // Handle Get Requests
    async function handleGetQueryRequest(route: string) {
        const response = await HandleGetRequest({ route: route });
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(false);
                setVehicleList(response.data)
            });
        }
    }

    // Handle Confirmation
    function handleConfirmation(){
        startTransition(() => {
            setLoading(true)
            setModalToggle(false)
        })
    }

    // Handle Vehicle Deletion
    async function handleVehicleDeletion(vehicleID: string){
        const response = await HandlePostRequest({
            data: { vehicleID: vehicleID },
            route: `${ROUTES.commonVehicleRoute}/${vehicleID}`,
            type: 'delete',
            toastDescription: 'Vehicle has deleted successfully'
        })
        if(response?.status === 200) handleConfirmation();
    } 

    return {
        filteredList,
        searchTerm,
        modalToggle, 
        setModalToggle,
        setSearchTerm,     
        handleVehicleDeletion,
        handleConfirmation,
    }
}

export default useVehiclePanel