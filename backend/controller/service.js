
import CONSTANT from "../constant/constant.js";
import Service from '../modal/service.js';
import ServiceCategory from "../modal/serviceCategory.js";
import ServiceItem from "../modal/serviceItem.js";
import User from "../modal/user.js";
import Vehicle from "../modal/vehicle.js";


const { RouteCode } = CONSTANT;

const getServiceList = async (req, res) => {
    const { centerID } = req.params;
    try {
        const services = await Service.find({centerID: centerID})
            .populate({
                path: 'serviceID', 
                select: 'name category vehicle', 
                populate: [
                    { path: 'category', select: 'name' }, 
                    { path: 'vehicle', select: 'name' } 
                ]
            })
            .sort({ createdAt: -1 });

        const serviceList = services.map(service => {
            const serviceItem = service.serviceID;

            return {
                id: service._id.toString(),
                serviceName: serviceItem.name ?? '',
                categoryID: serviceItem.category?._id.toString() ?? '',
                categoryName: serviceItem.category?.name ?? '',
                vehicleID: serviceItem.vehicle?._id.toString() ?? '',
                vehicleName: serviceItem.vehicle?.name ?? '',
                price: service.price ?? 0,
                discPrice: service.discPrice ?? 0,
                isAvailable: service.isAvailable,
                isCustomizable: service.isCustomizable,
                addons: service.addons.map(addon => ({
                    serviceName: addon.addonID?.name ?? '', // Make sure to populate the addonID if needed
                    price: addon.price,
                    discPrice: addon.discPrice,
                })) ?? []
            };
        });

        return res.status(RouteCode.SUCCESS.statusCode).json(serviceList);
    } catch (err) {
        console.error('Error retrieving service list:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getAPIServiceForm = async (req, res) => {
    try {
        const vehicleList = await Vehicle.find();
        const categoryList = await ServiceCategory.find();
        const serviceList = await ServiceItem.find();

        const availableServices = await Service.find();
        const availableList = availableServices.map(item => item.serviceID); // Make sure serviceID is the correct field

        const filteredServiceList = serviceList?.filter(item => !availableList.includes(item._id.toString()));

        const filterServiceListItem = filteredServiceList?.map(item => {return {id: item._id, name: item.name, categoryID: item.category, vehicleID: item.vehicle}});
        const addonServiceListItem = serviceList?.map(item => {return {id: item._id, name: item.name, categoryID: item.category, vehicleID: item.vehicle}});

        // Final response object
        const finalData = {
            categoryList: categoryList?.map(item => {return {id: item._id, name: item.name}}),
            vehicleList: vehicleList?.map(item => {return {id: item._id, name: item.name}}),
            serviceList: filterServiceListItem,
            filteredServiceList: filterServiceListItem,
            addonServiceList: addonServiceListItem,
            filteredAddonServiceList: addonServiceListItem,
        };
    
        return res.status(RouteCode.SUCCESS.statusCode).json(finalData);
    } catch (err) {
        console.error('Error retrieving service list:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postService = async (req, res) => {
    const userID = req.user;
    const { centerID, serviceID, price, discPrice, id, isCustomizable, addons } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundService = await Service.findOne({ serviceID, centerID: centerID });
        if (foundService) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Service already exists!' });
        }

        const validPrice = Number(price);
        const validDiscPrice = Number(discPrice);
        
        if (!Number.isFinite(validPrice) || !Number.isFinite(validDiscPrice) || validPrice < validDiscPrice) {
            return res.status(RouteCode.BAD_REQUEST.statusCode).json({ message: 'Invalid price or discount price' });
        }

        const newService = new Service({
            centerID: centerID,
            serviceID,
            isAvailable: true,
            isCustomizable: isCustomizable ?? false,
            price: validPrice,
            discPrice: validDiscPrice,
            addons: [],
        });

        if (addons?.length > 0) {
            newService.addons = addons.map(option => {
                const validAddonPrice = Number(option.price) ?? 0;
                const validAddonDiscPrice = Number(option.discPrice) ?? 0;

                if (option.serviceID && validAddonPrice >= validAddonDiscPrice) {
                    return {
                        addonID: option.serviceID,
                        price: validAddonPrice,
                        discPrice: validAddonDiscPrice,
                    };
                }
            }).filter(Boolean);
        }

        await newService.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Service has been added successfully' });

    } catch (err) {
        // Log error (ensure no sensitive data is exposed)
        console.error('Error creating service:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getInitServiceForm = async (req, res) => {
    const userID = req.user;
    const { serviceID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, try again!' });
        }

        const service = await Service.findById(serviceID);
        if (!service) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Service not found!' });
        }

        const formData = {
            id: service._id,
            serviceID: service.serviceID,
            price: service.price ?? 0,
            discPrice: service.discPrice ?? 0,
            isCustomizable: service.isCustomizable ?? false,
            addons: service.addons.length > 0 ? service.addons?.map(item => {
                return {
                    serviceID: item.addonID,
                    price: item.price ?? 0,
                    discPrice: item.discPrice ?? 0,
                }
            })  : []
        };

        return res.status(RouteCode.SUCCESS.statusCode).json(formData);
    } catch (err) {
        console.error('Error initializing service form:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putServiceDetails = async (req, res) => {
    const userID = req.user;
    const { centerID, serviceID, price, discPrice, isCustomizable, addons } = req.body;

    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundService = await Service.findOne({ serviceID });
        if (!foundService) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Service not found!' });
        }

        const validPrice = Number(price);
        const validDiscPrice = Number(discPrice);
        
        if (!Number.isFinite(validPrice) || !Number.isFinite(validDiscPrice) || validPrice < validDiscPrice) {
            return res.status(RouteCode.BAD_REQUEST.statusCode).json({ message: 'Invalid price or discount price' });
        }

        foundService.isCustomizable = isCustomizable;
        foundService.price = validPrice;
        foundService.discPrice = validDiscPrice;

        if (addons?.length > 0) {
            foundService.addons = addons.map(option => {
                const validAddonPrice = Number(option.price) ?? 0;
                const validAddonDiscPrice = Number(option.discPrice) ?? 0;

                if (option.serviceID && validAddonPrice >= validAddonDiscPrice) {
                    return {
                        addonID: option.serviceID,
                        price: validAddonPrice,
                        discPrice: validAddonDiscPrice,
                    };
                }
            }).filter(Boolean);
        }


        const result = await foundService.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Service details updated successfully' });

    } catch (err) {
        console.error('Error updating service details:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putServiceStatus = async (req, res) => {
    const userID = req.user;
    const { serviceID, value } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const service = await Service.findById(serviceID);
        if (!service) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        service.isAvailable = value;
        await service.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Service has updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const deleteService = async (req, res) => {
    const userID = req.user;
    const { serviceID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const service = await Service.findById(serviceID);
        if (!service) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        await service.deleteOne();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Service has been deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getServiceList, getAPIServiceForm,
    postService, getInitServiceForm, putServiceDetails, putServiceStatus, deleteService
}
