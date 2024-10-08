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

export type TService = {
    id: string;
    serviceName: string;
    categoryID: string;
    categoryName: string;
    vehicleID: string;
    vehicleName: string;
    price: number;
    discPrice: number;
    isAvailable: boolean;
    isCustomizable: boolean;
    addons: {
        serviceName: string;
        price: number;
        discPrice: number;
    }[]   
}

export type TCenter = {
    centerID: string;
    centerName: string;
    centerAbbreviation: string;
    centerAddress: string;    
}
