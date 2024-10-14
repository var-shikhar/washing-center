import User from "../modal/user.js";
import Center from "../modal/washingCenter.js";
import CONSTANT from "../constant/constant.js";
import MAILER from "../helper/nodemailer.js";
import COMMONFUN from "../helper/common.js";
import Vehicle from "../modal/vehicle.js";
import ServiceCategory from "../modal/serviceCategory.js";
import ServiceItem from "../modal/serviceItem.js";
import Service from "../modal/service.js";
import Booking from '../modal/booking.js';

const { RouteCode } = CONSTANT;
const { handleCenterCreationNotification } = MAILER;
const { getNameAbbreviation } = COMMONFUN;

// Center Form Controllers
const getCenterList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundCenters = await Center.find({ownerID: userID});
        let centerList = [];        

        if(foundCenters){
            centerList = foundCenters.map(center => {
                return {
                    centerID: center._id,
                    centerName: center.name,
                    centerPhone: center.phone,
                    centerAddress: center.geoAddress,
                    centerIsActive: center.isActive,
                    centerAbbreviation: getNameAbbreviation(center.name)
                }
            })
        }

        return res.status(RouteCode.SUCCESS.statusCode).json(centerList);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const postCenterForm = async (req, res) => {
    const userID = req.user;
    const {  centerName, centerEmail, centerPhone, centerDOI, timing, address, city, state, geoLocation } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundCenters = await Center.find({
            $or: [{ name: centerName.trim() }, { email: centerEmail }, { phone: centerPhone }],
        });
  
        if (foundCenters.length > 0) {
            let errorMessage = "A center with ";
        
            const nameMatch = foundCenters.some(center => center.name.trim() === centerName.trim());
            const emailMatch = foundCenters.some(center => center.email === centerEmail);
            const phoneMatch = foundCenters.some(center => center.phone === centerPhone);
        
            if (nameMatch && emailMatch && phoneMatch) {
            errorMessage += `name ${centerName}, email ${centerEmail}, and phone number ${centerPhone}`;
            } else if (nameMatch && emailMatch) {
            errorMessage += `name ${centerName} and email ${centerEmail}`;
            } else if (nameMatch && phoneMatch) {
            errorMessage += `name ${centerName} and phone number ${centerPhone}`;
            } else if (emailMatch && phoneMatch) {
            errorMessage += `email ${centerEmail} and phone number ${centerPhone}`;
            } else if (nameMatch) {
            errorMessage += `name ${centerName}`;
            } else if (emailMatch) {
            errorMessage += `email ${centerEmail}`;
            } else if (phoneMatch) {
            errorMessage += `phone number ${centerPhone}`;
            }
        
            errorMessage += " already exists.";
        
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({message: errorMessage});
        }
        
        const newCenter = new Center({
            name: centerName,
            email: centerEmail,
            phone: centerPhone,
            city: city,
            state: state,
            doi: centerDOI,
            geoAddress: address,
            coordinates: {
                type: 'Point',
                coordinates: [geoLocation.long, geoLocation.lat]
            },
            openingTiming: {
                stTime: timing.open,
                edTime: timing.close
            },
            ownerID: userID,
            isActive: false,
        });

        await handleCenterCreationNotification(centerName, foundUser.name, centerEmail);
        await newCenter.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Cener has been created successfully!'});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
};
const getInitDetails = async (req, res) => {
    const userID = req.user;
    const { centerID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }
        
        const centerData = await Center.findOne({ownerID: userID, _id: centerID});
        if(!centerData){
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Center not found, Try again!' });
        }

        const centerDetails = {
            address: centerData.geoAddress ?? '',
            city: centerData.city ?? '',
            state: centerData.state ?? '',
            geoLocation: {
              lat: centerData.coordinates.coordinates[1] ?? 0,
              long: centerData.coordinates.coordinates[0] ?? 0,
            },
            centerName: centerData.name ?? '',
            centerEmail: centerData.email ?? '',
            centerPhone: centerData.phone ?? '',
            centerDOI: centerData.doi ? new Date(centerData.doi).toISOString().split('T')[0] : '',
            timing: {
              open: centerData.openingTiming.stTime ?? '',
              close: centerData.openingTiming.edTime ?? '',
            },
            id: centerID
        }        

        return res.status(RouteCode.SUCCESS.statusCode).json(centerDetails);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const putCenterDetail = async (req, res) => {
    const userID = req.user;
    const { id, centerName, centerEmail, centerPhone, centerDOI, timing, address, city, state, geoLocation } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundCenter = await Center.findById(id);
        if (!foundCenter) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Center not found!' });
        }

        if (foundCenter.name.trim() !== centerName.trim()) {
            const hasSimilarName = await Center.findOne({ name: centerName.trim() });
            if (hasSimilarName) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Center name already exists, try another name!' });
            }
        }
        
        if (foundCenter.email !== centerEmail) {
            const hasSimilarEmail = await Center.findOne({ email: centerEmail });
            if (hasSimilarEmail) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Center email already exists, try another email!' });
            }
        }
        
        if (foundCenter.phone !== centerPhone) {
            const hasSimilarPhone = await Center.findOne({ phone: centerPhone });
            if (hasSimilarPhone) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Center phone already exists, try another phone!' });
            }
        }
        

        foundCenter.name = centerName ?? foundCenter.name;
        foundCenter.email = centerEmail ?? foundCenter.email;
        foundCenter.phone = centerPhone ?? foundCenter.phone;
        foundCenter.city = city ?? foundCenter.city;
        foundCenter.state = state ?? foundCenter.state;
        foundCenter.doi = new Date(centerDOI) ?? new Date(foundCenter.doi);
        foundCenter.geoAddress = address ?? foundCenter.geoAddress;
        foundCenter.coordinates = {
            type: 'Point',
            coordinates: [
                geoLocation.long ?? foundCenter.coordinates.coordinates[0],  // Longitude
                geoLocation.lat ?? foundCenter.coordinates.coordinates[1]    // Latitude
            ]
        };
        foundCenter.openingTiming = {
            stTime: timing.open ?? foundCenter.openingTiming.stTime,
            edTime: timing.close?? foundCenter.openingTiming.edTime,
        };

        await foundCenter.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Center details have been updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putCenterStatus = async (req, res) => {
    const userID = req.user;
    const { centerID, value } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }
        
        const centerData = await Center.findOne({ownerID: userID, _id: centerID});
        if(!centerData){
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Center not found, Try again!' });
        }

        centerData.isActive = value;
        await centerData.save();

        return res.status(RouteCode.SUCCESS.statusCode).json({message: `Center has been ${value ? 'activated' : 'in-activated'} successfully!`});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const deleteCenter = async (req, res) => {
    const userID = req.user;
    const { centerID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }
        
        const centerData = await Center.findOne({ ownerID: userID, _id: centerID });
        if(!centerData){
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Center not found, Try again!' });
        }

        await Center.deleteOne({ ownerID: userID, _id: centerID })        
        return res.status(RouteCode.SUCCESS.statusCode).json({message: `Center has been deleted successfully!`});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}

// Auth Context 
const getAuthCenterList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const foundCenters = await Center.find({ownerID: userID});
        let centerList = [];        

        if(foundCenters){
            centerList = foundCenters.map(center => {
                return {
                    centerID: center._id,
                    centerName: center.name,
                }
            })
        }

        return res.status(RouteCode.SUCCESS.statusCode).json(centerList);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}


// Public Center Controllers
const getTodaysBookingCount = async (centerID) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysBookingCount = await Booking.countDocuments({
        centerID: centerID,
        bookingDate: {
            $gte: startOfDay,
            $lt: endOfDay
        }
    });

    return todaysBookingCount;
};

const getCenterServices = async (req, res) => {
    const { centerID } = req.params;
    try {
        const foundCenter = await Center.findById(centerID)
        if(!foundCenter){
            res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Center not found, Try again!'})
        }

        const services = await Service.find({ centerID: foundCenter._id, isAvailable: true })
            .populate({ path: 'serviceID', select: 'name description category vehicle',
                populate: [{ path: 'category', select: 'name'}, { path: 'vehicle', select: 'name'}]
            })
            .populate({ path: 'addons.addonID', select: 'name description' })
            .exec();

        const serviceList = services?.map(item => {
            return {
                id: item._id,
                serviceID: item.serviceID,
                serviceName: item.serviceID.name,
                serviceDescription: item.serviceID.description,
                categoryID: item.serviceID.category._id,
                categoryName: item.serviceID.category.name,
                vehicleID: item.serviceID.vehicle._id,
                vehicleName: item.serviceID.vehicle.name,
                price: item.price,
                discPrice: item.discPrice,
                isAvailable: item.isAvailable,
                isCustomizable: item.isCustomizable,
                addons: item.addons?.map(addon => {
                    return {
                        serviceID: addon.addonID._id,
                        serviceName: addon.addonID.name,
                        serviceDescription: addon.addonID.description,
                        price: addon.price,
                        discPrice: addon.discPrice,
                    }
                })
            }
        });

        const finalServiceList = serviceList?.map(item => {
            let tempTotal = 0;
            let tempDiscountedTotal = 0;
        
            item.addons?.forEach(subItem => {
                tempTotal += subItem.price;
                tempDiscountedTotal += subItem.discPrice;
            });
        
            return {
                ...item,
                totalPrice: item.price + tempTotal,
                totalDiscountedPrice: item.discPrice + tempDiscountedTotal,
            };
        }) || [];


        const finalData = {
            centerID: foundCenter._id,
            centerName: foundCenter.name,
            centerPhone: foundCenter.phone,
            centerEmail: foundCenter.email,
            centerTiming: {
                stTime:  foundCenter.openingTiming.stTime,
                edTime:  foundCenter.openingTiming.edTime,
            },
            centerAddress: foundCenter.geoAddress,
            centerAbbreviation: getNameAbbreviation(foundCenter.name),
            centerGeoLocation: {
                lat: foundCenter.coordinates.coordinates[1] ?? 0,
                long: foundCenter.coordinates.coordinates[0] ?? 0,
            },
            todaysCount: await getTodaysBookingCount(centerID),
            serviceList: finalServiceList
        }

        return res.status(RouteCode.SUCCESS.statusCode).json(finalData);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const getPublicCenterList = async (req, res) => {
    const { lat, long, radius } = req.params;
    const parsedLat = parseFloat(lat).toFixed(5);
    const parsedLong = parseFloat(long).toFixed(5);
    const parsedRadius = Number(radius)

    if (isNaN(long) || isNaN(lat)) {
        return res.status(400).send('Invalid longitude or latitude values');
    }

    try {
        const foundCenters = (parsedLat === 0 || parsedLong === 0 || parsedRadius === 0)
            ? await Center.find({isActive: true}).populate() 
            : await Center.find({isActive: true, coordinates: { $geoWithin: { $centerSphere: [[parsedLong, parsedLat], parsedRadius / 6378.1] }}}).populate();

        const vehicleList = await Vehicle.find();  
        const categoryList = await ServiceCategory.find(); 
        const serviceList = await ServiceItem.find(); 

        const centerList = foundCenters?.length > 0 ? 
            await Promise.all(
                foundCenters.map(async center => {
                    const services = await Service.find({ centerID: center._id, isAvailable: true })
                        .populate({
                            path: 'serviceID',   
                            select: 'name category vehicle'
                        })
                        .populate({
                            path: 'addons.addonID',  
                            select: 'name'
                        }).exec();
                    
                    return {
                        centerID: center._id,
                        centerName: center.name,
                        centerPhone: center.phone,
                        centerAddress: center.geoAddress,
                        centerAbbreviation: getNameAbbreviation(center.name),
                        centerGeoLocation: {
                            lat: center.coordinates.coordinates[1] ?? 0,
                            long: center.coordinates.coordinates[0] ?? 0,
                        },
                        distance: 0,
                        services: services.map(service => ({
                            id: service._id,
                            serviceID: service.serviceID._id,
                            categoryID: service.serviceID?.category,
                            vehicleID: service.serviceID?.vehicle,
                            addons: service.addons?.length > 0 
                                ? service.addons.map(addItem => ({
                                    serviceID: addItem.addonID?._id,
                                }))
                                : []
                        }))
                    }})
            ) : []; 

        let finalData = {
            vehicleList: vehicleList?.length > 0 ? vehicleList.map(item => {return {id: item._id, name: item.name}}) : [],
            categoryList: categoryList?.length > 0 ? categoryList.map(item => {return {id: item._id, name: item.name}}) : [],
            serviceList: serviceList?.length > 0 ? serviceList?.map(item => {return {id: item._id, name: item.name, categoryID: item.category, vehicleID: item.vehicle}}) : [],
            centerList: centerList
        }

        return res.status(RouteCode.SUCCESS.statusCode).json(finalData);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}

export default {
    getAuthCenterList, getCenterList,
    postCenterForm, getInitDetails, putCenterDetail, putCenterStatus, deleteCenter,


    // Public Controller
    getPublicCenterList, getCenterServices
}