import CONSTANT from "../constant/constant.js";
import { handleImageDeleting, handleImageUploading } from "../helper/cloudinary.js";
import ServiceCategory from "../modal/serviceCategory.js";
import User from "../modal/user.js";

const { RouteCode } = CONSTANT;

// Get Service List
const getCategoryList = async (req, res) => {
    try {
        const categoryList = await ServiceCategory.find().sort({ createdAt: -1 });
        return res.status(RouteCode.SUCCESS.statusCode).json(categoryList);
    } catch (err) {
        console.error('Error retrieving category list:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
// Post Controller
const postCategory = async (req, res) => {
    const { categoryName } = req.body;
    try {
        let hasCategoryName = await ServiceCategory.findOne({ name: categoryName });
        if (hasCategoryName) {
            return res.status(RouteCode.CONFLICT.statusCode).json({
                message: 'Category name already exists, choose a different name!'
            });
        }

        const coverImageURL = req.files?.coverImage 
            ? await handleImageUploading(req.files.coverImage[0].buffer, req.files.coverImage[0].mimetype) 
            : '';

        const newCategory = new ServiceCategory({
            name: categoryName,
            coverImage: coverImageURL,
        });

        await newCategory.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Category added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
// Get Init Details
const getInitCategory = async (req, res) => {
    const userID = req.user;
    const { categoryID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, try again!' });
        }

        const category = await ServiceCategory.findById(categoryID);
        if (!category) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        const categoryDetails = {
            id: categoryID,
            categoryName: category.name ?? '',
        };

        return res.status(RouteCode.SUCCESS.statusCode).json(categoryDetails);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
// Put Controller
const putCategory = async (req, res) => {
    const { id, categoryName } = req.body;
    const hasCoverImage = req.files?.coverImage ? true : false;
    let coverImageUrl = '';
    try {
        const category = await ServiceCategory.findById(id);
        if (!category) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        if (category.name !== categoryName) {
            const hasName = await ServiceCategory.findOne({ name: categoryName });
            if (hasName) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Category name already exists, try a different name!' });
            }
        }

        if (hasCoverImage) {
            coverImageUrl = await handleImageUploading(req.files.coverImage[0].buffer, req.files.coverImage[0].mimetype);
            const prevCoverImage = category.coverImage?.split('/').pop().split('.')[0];
            if (prevCoverImage) {
                await handleImageDeleting(prevCoverImage);
            }
        }

        category.name = categoryName || category.name;
        category.coverImage = hasCoverImage ? coverImageUrl : category.coverImage;

        await category.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Category has been updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
// Delete Controller
const deleteCategory = async (req, res) => {
    const { categoryID } = req.params;
    try {
        const category = await ServiceCategory.findById(categoryID);
        if (!category) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        // Delete cover image if it exists
        if (category.coverImage) {
            const prevCoverImage = category.coverImage.split('/').pop().split('.')[0];
            await handleImageDeleting(prevCoverImage);
        }

        await category.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Category has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getCategoryList,
    postCategory, getInitCategory, putCategory, deleteCategory
}
