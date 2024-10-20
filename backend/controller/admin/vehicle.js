import constant from "../../constant/constant.js";
import AdminUser from "../../modal/adminUser.js";
import Vehicle from "../../modal/vehicle.js";

const { RouteCode } = constant;

const getVehicleList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const vehicles = await Vehicle.find();
        const foundVehicles = vehicles?.map(item => {
            return {
                id: item._id,
                name: item.name,
            }
        })

        return res.status(RouteCode.SUCCESS.statusCode).json(foundVehicles);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postVehicle = async (req, res) => {
    const userID = req.user;
    const { id, name } = req.body;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundVehicle = await Vehicle.findOne({ name: name });
        if (foundVehicle) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Vehicle already exists!' });
        }

        const newVehicle = new Vehicle({
            name: name,
        });

        await newVehicle.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Vehicle has been added successfully' });
    } catch (err) {
        console.error('Error creating Vehicle:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getInitVehicle = async (req, res) => {
    const userID = req.user;
    const { vehicleID } = req.params;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundVehicle = await Vehicle.findById(vehicleID);
        if (!foundVehicle) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Vehicle not found, Try again!' });
        }

        const vehicleData = {
            id: foundVehicle._id,
            name: foundVehicle.name, 
        }

        res.status(RouteCode.SUCCESS.statusCode).json(vehicleData);
    } catch (err) {
        console.error('Error creating Vehicle:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putVehicleDetail = async (req, res) => {
    const userID = req.user;
    const { id, name } = req.body;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundVehicle = await Vehicle.findById(id);
        if (!foundVehicle) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Vehicle not found, Try again!' });
        }

        if(foundVehicle.name !== name){
            const foundName = await Vehicle.findOne({name: name});
            if (foundName) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Vehicle name already exists, Try another name!' });
            }
        }

        foundVehicle.name = name ?? foundVehicle.name;
        await foundVehicle.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Vehicle has updated successfully' });
    } catch (err) {
        console.error('Error creating Vehicle:', err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteVehicle = async (req, res) => {
    const userID = req.user;
    const { vehicleID } = req.params;
    try {
        const foundUser = await AdminUser.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundVehicle = await Vehicle.findById(vehicleID);
        if (!foundVehicle) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Vehicle not found.' });
        }

        await foundVehicle.deleteOne();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Vehicle has been deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


export default {
    getVehicleList, postVehicle, getInitVehicle, putVehicleDetail, deleteVehicle
}