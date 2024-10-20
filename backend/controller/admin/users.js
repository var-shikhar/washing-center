import constant from "../../constant/constant.js";
import AdminUser from "../../modal/adminUser.js";
import User from "../../modal/user.js";
import Center from "../../modal/washingCenter.js";

const { RouteCode } = constant;

const getUsersList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const userList = await User.find({ isMember: false, userRole: 'Admin' }).sort({ createdAt: -1 });

        const foundUsers = await Promise.all(
            (userList || []).map(async user => {
                const totalCenter = await Center.countDocuments({ ownerID: user._id });
                return {
                    id: user._id,
                    partnerName: user.name,
                    partnerPhone: user.phone,
                    partnerEmail: user.email,
                    totalCenters: totalCenter,
                };
            })
        );

        res.status(RouteCode.SUCCESS.statusCode).json(foundUsers);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteUser = async (req, res) => {
    const adminUserID = req.user;
    const { userId } = req.params;
    try {
        const adminUser = await AdminUser.findById(adminUserID);
        if (!adminUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        // Find the user by ID
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'User not found!' });
        }

        // Delete the user
        await User.deleteOne({ _id: userId });

        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'User deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getUsersList, deleteUser
}