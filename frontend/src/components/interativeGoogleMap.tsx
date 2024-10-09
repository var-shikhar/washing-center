import { startTransition, useEffect, useRef, useState } from 'react';
import { TGooglePlaceMapProps } from './googleMap';

const GooglePlacesMap = ({ locationDetail, setLocationDetail, showAddress, mapClass }: TGooglePlaceMapProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);

    // Default Map Data
    const [defaultAddress, setDefaultAddress] = useState({
        address: locationDetail.address ?? '',
        geoLocation: {
            lat: locationDetail.geoLocation.lat !== 0 ? locationDetail.geoLocation.lat : 28.613459424004443,
            long: locationDetail.geoLocation.long !== 0 ? locationDetail.geoLocation.long : 77.2119140625,
        }
    });


    useEffect(() => {
        console.log(locationDetail)
        console.log(defaultAddress)
    }, [])

    // Initialize Google Maps API
    useEffect(() => {
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


    // Initiale Map
    const initMap = () => {
        if (mapRef.current) {
            const initialPosition = {
                lat: defaultAddress.geoLocation.lat, 
                lng: defaultAddress.geoLocation.long 
            };

            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: initialPosition,
                zoom: 5,
            });

            markerRef.current = new window.google.maps.Marker({
                position: initialPosition,
                map: mapInstance,
                draggable: true,
            });

            // Fetch Initial Values on Map
            if(defaultAddress.geoLocation.lat !== 0 && defaultAddress.geoLocation.long !== 0){
                fetchAddress(defaultAddress.geoLocation.lat, defaultAddress.geoLocation.long);
            }

            markerRef.current.addListener('dragend', () => {
                const lat = markerRef.current?.getPosition()?.lat();
                const lng = markerRef.current?.getPosition()?.lng();
                if (lat && lng) {
                    fetchAddress(lat, lng);
                }
            });

            const geocoder = new window.google.maps.Geocoder();
            const searchAddress = () => {
                if (inputRef.current?.value) {
                    geocoder.geocode({ address: inputRef.current.value }, (results, status) => {
                        if (status === window.google.maps.GeocoderStatus.OK && results) {
                            const place = results[0];
                            if (place.geometry) {
                                const location = place.geometry.location;
                                mapInstance.setCenter(location);
                                mapInstance.setZoom(15);
                                markerRef.current?.setPosition(location);
                                fetchAddress(location.lat(), location.lng());
                            }
                        } else {
                            console.error('Geocoding failed:', status);
                        }
                    });
                }
            };

            // Event listener for address search input
            if (inputRef.current) {
                inputRef.current.addEventListener('change', searchAddress);
            }
        }
    };

    // Fetch and Save address in State Variables
    const fetchAddress = (lat: number, lng: number) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results) {
                const formattedAddress = results[0].formatted_address;

                let city = '';
                let state = '';
    
                results[0].address_components.forEach((component) => {
                    const types = component.types;

                    if (types.includes('locality')) city = component.long_name;
                    if (types.includes('administrative_area_level_1')) state = component.long_name;
                });

                startTransition(() => {
                    setLocationDetail(prev => ({
                        ...prev,
                        address: formattedAddress,
                        geoLocation: { lat, long: lng } ,
                        city: city,
                        state: state                       
                    }));
                    setDefaultAddress(prev => ({...prev, address: formattedAddress}))
                })
            } else {
                console.error('Geocoding failed:', status);
            }
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <input
                ref={inputRef}
                type="text"
                placeholder="Enter a location"
                className='border rounded px-3 py-2 w-full my-2 focus:outline-none focus:ring'
                value={defaultAddress.address}
                onChange={(e) => setDefaultAddress(prev => ({...prev, address: e.target.value }))}
            />
            <div ref={mapRef} className={`h-[400px] w-full rounded-lg ${mapClass}`}></div>
            {showAddress && 
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Selected Address:</h3>
                    <p className="text-gray-800">{locationDetail.address}</p>
                    Latitude: <span className="font-normal text-gray-800">{locationDetail.geoLocation?.lat}</span> Longitude: <span className="font-normal text-gray-800">{locationDetail.geoLocation?.long}</span>
                </div>
            }
        </div>
    );
};

export default GooglePlacesMap;
