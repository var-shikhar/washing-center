import constant from "../../constant/constant.js";
import AdminUser from "../../modal/adminUser.js";
import ServiceCategory from "../../modal/serviceCategory.js";

const { RouteCode } = constant;

const getCategoryList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const category = await ServiceCategory.find().sort({name: 1});
        const foundCategory = category?.map(item => {
            return {
                id: item._id,
                name: item.name,
            }
        })

        return res.status(RouteCode.SUCCESS.statusCode).json(foundCategory);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postServiceCategory = async (req, res) => {
    const userID = req.user;
    const { id, name } = req.body;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundCategory = await ServiceCategory.findOne({ name: name });
        if (foundCategory) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Category already exists!' });
        }

        const newCategory = new ServiceCategory({
            name: name,
        });

        await newCategory.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Category has been added successfully' });
    } catch (err) {
        console.error('Error creating Vehicle:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getInitServiceCategory = async (req, res) => {
    const userID = req.user;
    const { categoryID } = req.params;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundCategory = await ServiceCategory.findById(categoryID);
        if (!foundCategory) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Category not found, Try again!' });
        }

        const categoryData = {
            id: foundCategory._id,
            name: foundCategory.name, 
        }

        res.status(RouteCode.SUCCESS.statusCode).json(categoryData);
    } catch (err) {
        console.error('Error creating Vehicle:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putServiceCategoryDetail = async (req, res) => {
    const userID = req.user;
    const { id, name } = req.body;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundCategory = await ServiceCategory.findById(id);
        if (!foundCategory) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Service Category not found, Try again!' });
        }

        if(foundCategory.name !== name){
            const foundName = await ServiceCategory.findOne({name: name});
            if (foundName) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Service Category name already exists, Try another name!' });
            }
        }

        foundCategory.name = name ?? foundCategory.name;
        await foundCategory.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Service Category has updated successfully' });
    } catch (err) {
        console.error('Error editing Service Category:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteServiceCategory = async (req, res) => {
    const userID = req.user;
    const { categoryID } = req.params;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundCategory = await ServiceCategory.findById(categoryID);
        if (!foundCategory) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Category not found.' });
        }

        await foundCategory.deleteOne();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Category has been deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


export default {
    getCategoryList, postServiceCategory, getInitServiceCategory, putServiceCategoryDetail, deleteServiceCategory
}