import constant from "../../constant/constant.js";
import AdminUser from "../../modal/adminUser.js";
import Service from "../../modal/service.js";
import ServiceCategory from "../../modal/serviceCategory.js";
import ServiceItem from "../../modal/serviceItem.js";
import Vehicle from "../../modal/vehicle.js";

const { RouteCode } = constant;

const getServiceList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const services = await ServiceItem.find().populate('category', 'name').populate('vehicle', 'name');
        const foundServices = services?.map(item => {
            return {
                id: item._id,
                name: item.name,
                categoryID: item.category,
                vehicleID: item.vehicle,
                categoryName: item.category.name,
                vehicleName: item.vehicle.name,
                serviceDescription: item.description,
            }
        })

        return res.status(RouteCode.SUCCESS.statusCode).json(foundServices);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getAPIServiceForm = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const vehicleList = await Vehicle.find();
        const categoryList = await ServiceCategory.find()
        
        const foundList = {
            categoryList: categoryList?.map(item => {return {id: item._id, name: item.name}}),
            vehicleList: vehicleList?.map(item => {return {id: item._id, name: item.name}}),
        }

        return res.status(RouteCode.SUCCESS.statusCode).json(foundList);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postService = async (req, res) => {
    const userID = req.user;
    const { id, serviceName, categoryID, vehicleID, serviceDescription } = req.body;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundService = await ServiceItem.findOne({ name: serviceName });
        if (foundService) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Service already exists!' });
        }

        const newService = new ServiceItem({
            name: serviceName,
            category: categoryID,
            vehicle: vehicleID,
            description: serviceDescription,
        });

        await newService.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Service has been added successfully' });
    } catch (err) {
        console.error('Error creating service:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getInitService = async (req, res) => {
    const userID = req.user;
    const { serviceID } = req.params;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundService = await ServiceItem.findById(serviceID);
        if (!foundService) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Service not found, Try again!' });
        }

        const serviceData = {
            id: foundService._id,
            serviceName: foundService.name,
            categoryID: foundService.category,
            vehicleID: foundService.vehicle,
            serviceDescription: foundService.description 
        }

        res.status(RouteCode.SUCCESS.statusCode).json(serviceData);
    } catch (err) {
        console.error('Error creating service:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putServiceDetail = async (req, res) => {
    const userID = req.user;
    const { id, serviceName, categoryID, vehicleID, serviceDescription } = req.body;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundService = await ServiceItem.findById(id);
        if (!foundService) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Service not found, Try again!' });
        }

        if(foundService.name !== serviceName){
            const foundName = await ServiceItem.findOne({name: serviceName});
            if (foundName) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Service name already exists, Try another name!' });
            }
        }

        foundService.name = serviceName ?? foundService.name;
        foundService.category = categoryID ?? foundService.category;
        foundService.vehicle = vehicleID ?? foundService.vehicle;
        foundService.description = serviceDescription ?? foundService.description;

        await foundService.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Service has updated successfully' });
    } catch (err) {
        console.error('Error creating service:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteService = async (req, res) => {
    const userID = req.user;
    const { serviceID } = req.params;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const isServiceItemUsed = await Service.findOne({
            $or: [
                { serviceID: serviceID },
                { 'addons.addonID': serviceID }
            ]
        });

        if (isServiceItemUsed) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ 
                message: 'Service is used in existing Services and cannot be deleted.'
            });
        }

        const serviceItem = await ServiceItem.findById(serviceID);
        if (!serviceItem) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Service not found.' });
        }

        await serviceItem.deleteOne();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Service has been deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


export default {
    getAPIServiceForm, postService, putServiceDetail, getInitService, deleteService,
    getServiceList
}