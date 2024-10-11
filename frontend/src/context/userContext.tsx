import useAxioRequests from '@/lib/axioRequest';
import ROUTES from '@/lib/routes';
import React, { createContext, useState, useContext, useMemo, startTransition, useEffect } from 'react';

type TUserData = {
    userID: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    userRole: string;
    isMember: boolean;
    isActive: boolean;
    isEmailVerified: boolean;
    centerList: {
        id: string;
        name: string;
        city: string;
    }
}

export type TContextCenterList = {
    centerID: string;
    centerName: string;
}

type TUserContext = {
    isLoggedIn: boolean; 
    userID: string | null;
    userData: TUserData | null;
    selectedCenter: string | null;
    centerList: TContextCenterList[] | [];
    handleCenterSelection: (centerID: string, hasTransition: boolean) => void;
    handleCenterRemoval: () => void;
    handleLoggedIn: (value: string) => void;
    handleLoggedOut: () => void;
}

const UserContext = createContext<TUserContext | undefined>(undefined);

export const UserProvider = ({ children }: {children: React.ReactNode}) => {
    const { HandleGetRequest } = useAxioRequests();
    const [loading, setLoading] = useState({
        userDetails: true,
        centerList: true,
    });
    const [isLoggedIn, setISLoggedIn] = useState(() => {
        const storedData = sessionStorage.getItem('isLoggedIn');
        return  storedData === 'true' ? true  : false;
    });
    const [userID, setUserID] = useState<TUserContext['userID']>(() => {
        const storedData = sessionStorage.getItem('userID');
        return  storedData ? storedData : null;
    });
    const [userData, setUserData] = useState<TUserContext['userData']>(() => {
        const storedData = sessionStorage.getItem('userData');
        return storedData ? JSON.parse(storedData) : null;
      });
    const [selectedCenter, setSelectedCenter] = useState<TUserContext['selectedCenter']>(() => {
        const storedData = sessionStorage.getItem('selectedCenter');
        return storedData ? storedData : null;
    });

    const [centerList, setCenterList] = useState<TUserContext['centerList']>(() => {
        const storedData = sessionStorage.getItem('centerList');
        return storedData ? JSON.parse(storedData) : [];
    });

    
    useEffect(() => {
        if(loading.userDetails && userID !== null) handleGetQueryRequests(ROUTES.commonLoginRoute)
    }, [userID, loading.userDetails])

    // Handle Get Query
    async function handleGetQueryRequests(route: string) {
        const response = await HandleGetRequest({ route: route });
        if(response?.status === 200){
            startTransition(() => {
                setUserData(prev => ({...prev, ...response.data}));
                setLoading(prev => ({...prev, userDetails: false}));
                
                sessionStorage.setItem('userData', JSON.stringify(response.data));
            })
        } else {
            startTransition(() => {
                setISLoggedIn(false);
                setLoading(prev => ({...prev, userDetails: false}));
                setUserID(null);
                
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('userID');
            }) 
        }
    }

    // Handle Login
    function handleLoggedIn(value: string){
        startTransition(() => {
            if(value !== ''){
                setISLoggedIn(true);
                setUserID(value);
                setLoading(prev => ({...prev, userDetails: true}));

                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userID', value);
            } else {
                setISLoggedIn(false)
                setUserID(null);

                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('userID');
            }
        })
    }

    // Handle Logout
    function handleLoggedOut(){
        startTransition(() => {
            setISLoggedIn(false);
            setUserID(null);
            setUserData(null);
            setSelectedCenter(null);
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('userID');
            sessionStorage.removeItem('userData');
            sessionStorage.removeItem('selectedCenter');
            sessionStorage.removeItem('centerList');
        })
    }

    // Handle Center Selection
    async function handleCenterSelection(centerID: string, hasTransition: boolean){
        if(loading.centerList && centerList.length <= 0){
            const response = await HandleGetRequest({ route: ROUTES.authCenterRoute });
            if(response?.status === 200){
                startTransition(() => {
                    setSelectedCenter(centerID);
                    setCenterList(response.data)
                    setLoading(prev => ({...prev, centerList: false}))
    
                    sessionStorage.setItem('centerList', JSON.stringify(response.data));
                    sessionStorage.setItem('selectedCenter', centerID);
                })
            }
        } else {
            startTransition(() => {
                setSelectedCenter(centerID);
                sessionStorage.setItem('selectedCenter', centerID);
            })
        }
        if(hasTransition){
            window.location.href = '../services';
        }
    }

    // Handle Center Removal
    async function handleCenterRemoval(){
        startTransition(() => {
            setSelectedCenter(null);
            sessionStorage.removeItem('selectedCenter');
            window.location.href = '../center';
        });
    }

    // Memorize User Context Values
    const contextValue = useMemo(
        () => ({
          isLoggedIn,
          userID,
          userData,
          selectedCenter,
          centerList,
          handleCenterSelection,
          handleCenterRemoval,
          handleLoggedIn,
          handleLoggedOut,
        }),
        [isLoggedIn, userID, userData, selectedCenter, centerList]
    );

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const userContext = useContext(UserContext);
    if (userContext === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return userContext;
};
