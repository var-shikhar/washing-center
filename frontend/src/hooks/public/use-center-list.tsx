import { toast } from '@/components/ui/use-toast';
import useAxioRequests from '@/lib/axioRequest';
import { TCenter, TService, TServiceCategory, TServiceItem, TServiceVehicle } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

type TCenters = {
  centerID: string;
  centerName: string;
  centerPhone: number;
  centerAddress: string;
  centerAbbreviation: string;
  services: TService[]
}

type TCenterListType = TCenter & {
  vehicleList: TServiceVehicle[],
  categoryList: TServiceCategory[],
  serviceList: TServiceItem[],
  centerList: TCenters[],
}

export type TFilterTypes = 'vehicleType' | 'category' | 'service';

const usePublicCenterList = () => {
  const { HandleGetRequest } = useAxioRequests();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [centerList, setCenterList] = useState<TCenterListType>({} as TCenterListType);
  const [filteredList, setFilteredList] = useState<TCenters[]>([] as TCenters[]);


  const [selectedValues, setSelectedValues] = useState({
    vehicleType: new Set<string>(),
    category: new Set<string>(),
    service: new Set<string>(),
  });
  
  
  const [defaultData, setDefaultData] = useState({
    lat: 0,
    long: 0,
    radius: 5
  })

  useLayoutEffect(() => {
    checkLocationPermission();
  }, [])

  // Check Location Permission Access
  async function checkLocationPermission(): Promise<void> {
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
  
    if (permissionStatus.state === 'denied') {
      console.log("Location access was denied. Please enable it.");
      showLocationDeniedMessage();
    } else {
      getLocation();
    }
  }
  // Fetch the Location Details
  function getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => showPosition(position),
        (error) => showError(error)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }
  // Save Location Details
  function showPosition(position: GeolocationPosition): void {
    const { latitude, longitude } = position.coords;
    startTransition(() => {
      setDefaultData(prev => ({...prev, lat: latitude, long: longitude}));
    })
  }
  // Show Errors
  function showError(error: GeolocationPositionError): void {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        showLocationDeniedMessage();
        break;
      case error.TIMEOUT:
      case error.POSITION_UNAVAILABLE:
      default:
        toast({
          title: 'Error',
          description: "Something went wrong, Try later!"
        })
        break;
    }
    // navigate('../')
  }
  // Show Error Message
  function showLocationDeniedMessage(): void {
    toast({
      title: 'Error',
      description: "Location access is required. Please enable it in your browser settings."
    })
    // navigate('../')
  }
  
  useEffect(() => {
    if(loading) handleGetQueryRequest(`${ROUTES.publicCenterListRoute}/${defaultData.lat}/${defaultData.long}/${defaultData.radius}`)
  }, [loading, defaultData.lat, defaultData.long, defaultData.radius])

  useEffect(() => {
    if (centerList.centerList?.length > 0) {
      let tempList = centerList.centerList;

      if (selectedValues.vehicleType.size > 0 || selectedValues.category.size > 0 || selectedValues.service.size > 0) {
        tempList = tempList.filter(center => {
          const services = center.services || [];

          const supportsVehicle = selectedValues.vehicleType.size === 0 || 
            services.some(service => service && selectedValues.vehicleType.has(service.vehicleID));

          const supportsCategory = selectedValues.category.size === 0 || 
            services.some(service => service && selectedValues.category.has(service?.categoryID));

            const supportsService = selectedValues.service.size === 0 || 
              services.some(service => service && selectedValues.service.has(service.id));
                
          return supportsVehicle && supportsCategory && supportsService;
        });
      }

      startTransition(() => {
        setFilteredList(tempList);
      });
    }
  }, [centerList, selectedValues]);

  // Handle Get Requests
  async function handleGetQueryRequest(route: string){
    const response = await HandleGetRequest({ route: route });
    if(response?.status === 200){
      startTransition(() => {
        setCenterList(response.data);
      })
    }
    setLoading(false);
  }


  const handleSelectionChange = (type: TFilterTypes, value: string) => {
    setSelectedValues((prev) => {
      const updatedSet = new Set(prev[type]);
      updatedSet.has(value) ? updatedSet.delete(value) : updatedSet.add(value);
      return { ...prev, [type]: updatedSet };
    });
  };
  

  return {
    centerList,
    filteredList,
    selectedValues,
    handleSelectionChange,
  }
}

export default usePublicCenterList