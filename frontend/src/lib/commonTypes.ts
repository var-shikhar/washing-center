export type TServiceCategory = {
    id: string;
    name: string;
}

export type TServiceVehicle = {
    id: string;
    name: string;
}

export type TServiceItem = {
    id: string;
    name: string;
    categoryID: string;
    vehicleID: string;
}

export type TServiceSkeleton = {
    id: string;
    serviceID: string;
    categoryID: string;
    vehicleID: string;
    addons: {
        serviceID: string;
    }[]   
}

export type TService = Omit<TServiceSkeleton, 'addons'> & {
    addons: {
        serviceID: string;
        serviceName: string;
        serviceDescription?: string;
        price: number;
        discPrice: number;
    }[];
    serviceName: string;
    serviceDescription?: string;
    categoryName: string; 
    vehicleName: string;
    price: number;      
    discPrice: number;  
    isAvailable: boolean; 
    isCustomizable: boolean;
    totalPrice?: number;
    totalDiscountedPrice?: number;
};

export type TCenter = {
    centerID: string;
    centerName: string;
    centerAbbreviation: string;
    centerAddress: string; 
    centerPhone?: number;
    centerEmail?: string;
    centerTiming?: { 
        stTime: string, 
        edTime: string
    },
    centerGeoLocation?: {
        lat: number,
        long: number,
    },   
    todaysCount?: number;
}

export type TBookingList = {
    id: string;
    clientName: string;
    clientNumber: string;
    appointmentDate: Date,
    appointmentTime: string;
    isRescheduled: boolean;
    message: string;
    serviceID: string;
    serviceName: string;
    addonList: {
        addonID: string;
        addonName: string;
    }[];
    totalAmount: number;
    status: string;
}