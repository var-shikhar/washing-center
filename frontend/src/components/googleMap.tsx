import React, { useEffect, useRef, useState } from 'react';

export type TLocationObj = {
    address: string;
    city: string;
    state: string;
    geoLocation: {
        lat: number;
        long: number;
    }
}

type TGooglePlaceMapProps = {
    locationDetail: TLocationObj
    setLocationDetail: React.Dispatch<React.SetStateAction<TLocationObj>>
    showAddress: boolean;
    mapClass: string;
}

const GooglePlacesMap = ({ locationDetail, setLocationDetail, showAddress, mapClass }: TGooglePlaceMapProps ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const defaultAddress = locationDetail.address ?? '';    

    useEffect(() => {
        // Initialize Google Maps API
        const loadGoogleMaps = () => {
            if (!window.google?.maps) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD3_PRUxLRb7tkxX1dhHZHRFDDQ7_R8E_Q&libraries=places`;
                script.async = true;
                script.onload = initMap;
                document.body.appendChild(script);
            } else {
                initMap();
            }
        };

        loadGoogleMaps();
    }, []);


    useEffect(() => {
        // If a default address is provided, populate the input and fetch details
        if (defaultAddress !== undefined && defaultAddress !== '' && inputRef.current) {
            inputRef.current.value = defaultAddress; // Set the input field
            setTimeout(() => {
                fetchAddressByPlaceName(defaultAddress); // Fetch details based on the address
            }, 1000)
        }
    }, []);

    const initMap = () => {
        if (mapRef.current) {
            const initialPosition = { lat: 20.5937, lng: 78.9629 };
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: initialPosition,
                zoom: 5,
            });

            const autoCompleteInstance = new window.google.maps.places.Autocomplete(inputRef.current as HTMLInputElement, {
                fields: ['geometry', 'name', 'formatted_address', 'address_components'],
                componentRestrictions: { country: 'IN' }, // Restrict to India
            });

            autoCompleteInstance.addListener('place_changed', () => {
                const place = autoCompleteInstance.getPlace();
                if (place.address_components && place.geometry && place.geometry.location && place.formatted_address) {
                    const location = place.geometry.location;
                    mapInstance.setCenter(location);
                    mapInstance.setZoom(15);
                    // New One  
                    mapInstance.setCenter(location);

                    // Add the new marker
                    new window.google.maps.Marker({
                        position: location,
                        map: mapInstance,
                    });


                    // Fetch the address
                    fetchAddress(location.lat(), location.lng(), place.address_components);                    
                    inputRef.current!.value = place.formatted_address;
                    setLocationDetail(prev => ({
                        ...prev, 
                        address: place.formatted_address ?? '',
                        geoLocation: { lat: location.lat(), long: location.lng() }
                    }))
                } else {
                    console.error('No valid geometry found for the selected place:', place);
                    alert('No details available for input: ' + place.name);
                }
            });
        } else {
            console.error("Map reference is null");
        }
    };

    const fetchAddress = (lat: number, lng: number, addressComponents: google.maps.GeocoderAddressComponent[]) => {
        if (window.google) {
            const geocoder = new window.google.maps.Geocoder();
            const latlng = { lat, lng };

            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK) { 
                    if (results && results.length > 0) {
                        const formattedAddress = results[0].formatted_address;
                        setLocationDetail(prev => ({...prev, address: formattedAddress}));
                        // Extract city and state from address components
                        const cityComponent = addressComponents.find(comp => comp.types.includes('locality'));
                        const stateComponent = addressComponents.find(comp => comp.types.includes('administrative_area_level_1'));
                        
                        setLocationDetail(prev => ({
                            ...prev,
                            address: formattedAddress,
                            city: cityComponent ? cityComponent.long_name : '',
                            state: stateComponent ? stateComponent.long_name : ''
                        }));
                    } else {
                        setLocationDetail(prev => ({...prev, address: 'No address found'}));
                    }
                } else {
                    console.error('Geocoder failed due to: ' + status);
                }
            });
        } else {
            console.error("Google Maps API not loaded properly.");
        }
    };

    const fetchAddressByPlaceName = (placeName: string) => {
        const geocoder = new window.google.maps.Geocoder();
        if(geocoder){
            geocoder.geocode({ address: placeName }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK && results) {
                    const place = results[0];
                    if (place && place.geometry) {
                        const location = place.geometry.location;
                        setLocationDetail(prev => ({...prev, geoLocation: {lat: location.lat(), long: location.lng()}}))
                        fetchAddress(location.lat(), location.lng(), place.address_components);
                    }
                } else {
                    console.error('Geocoding failed due to: ' + status);
                }
            });
        }
    };

    // Handle changes in the input field
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocationDetail(prev => ({...prev, address: event.target.value}));
        inputRef.current!.value = event.target.value;
    };

    return (
        <div style={{ position: 'relative' }}>
            <input
                ref={inputRef}
                type="text"
                placeholder="Enter your address"
                className='border rounded px-3 py-2 w-full my-2 focus:outline-none focus:ring'
                value={locationDetail.address}
                onChange={handleInputChange}
            />
            <div ref={mapRef} className={`h-[400px] w-full rounded-lg ${mapClass}`}></div>
            {showAddress && 
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Fetched Address:</h3>
                    <p className="text-gray-800">{locationDetail.address}</p>
                    Latitude: <span className="font-normal text-gray-800">{locationDetail.geoLocation?.lat}</span> Longitude: <span className="font-normal text-gray-800">{locationDetail.geoLocation?.long}</span>
                </div>
            }
        </div>
    );
};

export default GooglePlacesMap;