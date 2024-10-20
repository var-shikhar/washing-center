import React, { createContext, useState, useContext } from 'react';


type TLoaderContext = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const LoaderContext = createContext<TLoaderContext | null>(null);


export const useLoader = () => {
    const loadContext = useContext(LoaderContext);
    if (loadContext === null) {
        throw new Error("useLoader must be used within a LoaderProvider");
    }
    return loadContext;
};


export const LoaderProvider = ({ children }: {children: React.ReactNode}) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};
