import constant from "../../constant/constant.js";
import AdminUser from "../../modal/adminUser.js";
import Center from "../../modal/washingCenter.js";

const { RouteCode } = constant;

const getCenterList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundCenters = await Center.find().populate('ownerID');
        let centerList = [];
        let unListedCenterList = [];

        if (foundCenters) {
            foundCenters.forEach(center => {
                const centerData = {
                    centerID: center._id.toString(),
                    centerName: center.name,
                    centerAddress: center.geoAddress,
                    centerPhone: center.phone || null,
                    centerEmail: center.email || null,
                    centerTiming: center.openingTiming ? {
                        stTime: center.openingTiming.stTime,
                        edTime: center.openingTiming.edTime
                    } : undefined,
                    centerGeoLocation: center.coordinates ? {
                        lat: center.coordinates.coordinates[1],
                        long: center.coordinates.coordinates[0]
                    } : undefined,
                    ownerName: center.ownerID?.name,
                    isActive: center.isActive,
                    isLive: center.isLive
                };

                // Separate the centers based on their isLive status
                if (center.isLive) {
                    centerList.push(centerData);
                } else {
                    unListedCenterList.push(centerData);
                }
            });
        }

        // Create the response object in TCenterOBJ format
        const responseObj = {
            centerList,
            unListedCenterList
        };

        return res.status(RouteCode.SUCCESS.statusCode).json(responseObj);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putCenterStatus = async (req, res) => {
    const userID = req.user;
    const { centerID } = req.body;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }
        
        const centerDetails = await Center.findById(centerID);
        if(!centerDetails){
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Center not found, Try again!' });
        }

        centerDetails.isActive = !centerDetails.isActive;
        await centerDetails.save();
        res.status(RouteCode.SUCCESS.statusCode).json({message: `Center has been ${centerDetails.isActive ? 'activated' : 'in-activated'} successfully!`});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const postCenterListingStatus = async (req, res) => {
    const userID = req.user;
    const { centerID } = req.body;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }
        
        const centerDetails = await Center.findById(centerID);
        if(!centerDetails){
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Center not found, Try again!' });
        }

        centerDetails.isLive = !centerDetails.isLive;
        await centerDetails.save();
        res.status(RouteCode.SUCCESS.statusCode).json({message: `Center has been ${centerDetails.isLive ? 'Listed' : 'Un-Listed'} successfully!`});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const deleteCenter = async (req, res) => {
    const userID = req.user;
    const { centerID } = req.params;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }
        
        const centerDetail = await Center.findById(centerID);
        if(!centerDetail){
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Center not found, Try again!' });
        }

        await centerDetail.deleteOne();        
        return res.status(RouteCode.SUCCESS.statusCode).json({message: `Center has been deleted successfully!`});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}

export default {
    getCenterList,
    putCenterStatus, postCenterListingStatus, 
    deleteCenter
}