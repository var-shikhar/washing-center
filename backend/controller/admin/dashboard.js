import constant from "../../constant/constant.js";
import AdminUser from "../../modal/adminUser.js";
import Booking from "../../modal/booking.js";
import User from "../../modal/user.js";
import Center from "../../modal/washingCenter.js";
import commonFn from '../../helper/common.js';

const { RouteCode } = constant;
const { getNameAbbreviation } = commonFn;

const getAdminDashboardData = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const totalUsers = await User.countDocuments({ isMember: true });
        const totalPartners = await User.countDocuments({ isMember: false });
        const totalLiveCenters = await Center.countDocuments({ isLive: true });
        const totalUnLiveCenters = await Center.countDocuments({ isLive: false });
        const totalActiveCenters = await Center.countDocuments({ isActive: true });
        const totalInActiveCenters = await Center.countDocuments({ isActive: false });
        const totalBookings = await Booking.countDocuments({ status: 'Completed' });

        const bookingList = [];

        const recentBookings = await Booking.find().populate({
            path: 'serviceID',
            populate: {
                path: 'serviceID',
                model: 'ServiceItem',
                select: 'name category vehicle description coverImage'
            }
        })
        .limit(3).exec();

        recentBookings.forEach(booking => {
            const serviceName = booking.serviceID?.serviceID?.name || 'Unknown Service';
            const serviceAmount = booking.totalAmount || 0;
            const serviceType = booking.isPublicBooking || false;
            const clientName = booking.userName || 'Unknown Client';
            const abbreviation = getNameAbbreviation(clientName);

            bookingList.push({
                id: booking._id,
                serviceName,
                serviceAmount,
                serviceType,
                clientName,
                abbreviation,
            });
        });

        const finalData = {
            totalUsers,
            totalPartners,
            totalLiveCenters,
            totalUnLiveCenters,
            totalActiveCenters,
            totalInActiveCenters,
            totalBookings,
            bookingList,
        };

        return res.status(RouteCode.SUCCESS.statusCode).json(finalData);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


export default {
    getAdminDashboardData
}