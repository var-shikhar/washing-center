import CONSTANT from "../constant/constant.js";
import { handleImageDeleting, handleImageUploading } from "../helper/cloudinary.js";
import ServiceItem from "../modal/serviceItem.js";
import User from "../modal/user.js";

const { RouteCode } = CONSTANT;

// Get Service List
const getServiceItemList = async (req, res) => {
    try {
        const serviceItemList = await ServiceItem.find().sort({ createdAt: -1 }).populate('category', 'name');
        return res.status(RouteCode.SUCCESS.statusCode).json(serviceItemList);
    } catch (err) {
        console.error('Error retrieving service item list:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
// Post Controller
const postServiceItem = async (req, res) => {
    const userID = req.user;
    const { serviceName, serviceCategory, serviceDescription, servicePrice, serviceDiscountedPrice } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, try again!' });
        }

        let hasServiceName = await ServiceItem.findOne({ name: serviceName });
        if (hasServiceName) {
            return res.status(RouteCode.CONFLICT.statusCode).json({
                message: 'Service name already exists, choose a different name!'
            });
        }

        const coverImageURL = req.files?.coverImage 
            ? await handleImageUploading(req.files.coverImage[0].buffer, req.files.coverImage[0].mimetype) 
            : '';

        const newServiceItem = new ServiceItem({
            name: serviceName,
            category: serviceCategory,
            description: serviceDescription ?? '',
            price: servicePrice ?? 0,
            discountedPrice: serviceDiscountedPrice ?? 0,
            coverImage: coverImageURL,
        });

        await newServiceItem.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Service item added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
// Get Init Details
const getInitServiceItem = async (req, res) => {
    const userID = req.user;
    const { serviceID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, try again!' });
        }

        const serviceItem = await ServiceItem.findById(serviceID).populate('category', 'name');
        if (!serviceItem) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        const serviceDetails = {
            id: serviceItem._id,
            serviceName: serviceItem.name ?? '',
            serviceCategory: serviceItem.category._id ?? '',
            servicePrice: serviceItem.price ?? '',
            serviceDiscountedPrice: serviceItem.discountedPrice ?? '',
            serviceDescription: serviceItem.description ?? '',
        };

        return res.status(RouteCode.SUCCESS.statusCode).json(serviceDetails);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
// Put Controller
const putServiceItem = async (req, res) => {
    const userID = req.user;
    const {  id, serviceName, serviceCategory, serviceDescription, servicePrice, serviceDiscountedPrice } = req.body;
    const hasCoverImage = req.files?.coverImage ? true : false;
    let coverImageUrl = '';
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, try again!' });
        }

        const serviceItem = await ServiceItem.findById(id);
        if (!serviceItem) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        if (serviceItem.name !== serviceName) {
            const hasName = await ServiceItem.findOne({ name: serviceName });
            if (hasName) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Service name already exists, try a different name!' });
            }
        }

        if (hasCoverImage) {
            coverImageUrl = await handleImageUploading(req.files.coverImage[0].buffer, req.files.coverImage[0].mimetype);
            const prevCoverImage = serviceItem.coverImage?.split('/').pop().split('.')[0];
            if (prevCoverImage) {
                await handleImageDeleting(prevCoverImage);
            }
        }

        serviceItem.name = serviceName || serviceItem.name;
        serviceItem.category = serviceCategory || serviceItem.category;
        serviceItem.description = serviceDescription || serviceItem.description;
        serviceItem.price = servicePrice ?? serviceItem.price;
        serviceItem.discountedPrice = serviceDiscountedPrice ?? serviceItem.discountedPrice;
        serviceItem.coverImage = hasCoverImage ? coverImageUrl : serviceItem.coverImage;

        await serviceItem.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Service item has been updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
// Delete Controller
const deleteServiceItem = async (req, res) => {
    const userID = req.user;
    const { serviceID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, try again!' });
        }

        const serviceItem = await ServiceItem.findById(serviceID);
        if (!serviceItem) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        if (serviceItem.coverImage) {
            const prevCoverImage = serviceItem.coverImage.split('/').pop().split('.')[0];
            await handleImageDeleting(prevCoverImage);
        }

        await serviceItem.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Service item has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


export default {
    getServiceItemList,
    postServiceItem, getInitServiceItem, putServiceItem, deleteServiceItem
}