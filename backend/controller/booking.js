import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import constant from "../constant/constant.js";
import MAILER from '../helper/nodemailer.js';
import User from "../modal/user.js";
import { generateOTP, validateOTP } from "./auth.js";
import Booking from '../modal/booking.js';
import Center from '../modal/washingCenter.js';
import Service from '../modal/service.js';
import ServiceItem from '../modal/serviceItem.js';
import { io } from '../index.js';

dotenv.config();
const { RouteCode } = constant;
const { handleLoginOTP, handleBookingCreation, handleBookingReschedule, handleBookingStatusUpdate } = MAILER;
const { JWT_SECRET_KEY } = process.env;


async function sendOTPforLogin(userID, userEmail){
    const sharedOTP = await generateOTP(userID);
    await handleLoginOTP(userEmail, sharedOTP);
}
const postValidateEmail = async (req, res) => {
    const { userEmail } = req.body;
    try {
        const user = await User.findOne({email: userEmail});
        if (user) {
            await sendOTPforLogin(user._id, user.email)
            const jwtToken = jwt.sign({ email: user.email }, JWT_SECRET_KEY, { expiresIn: '1d' });
            res.cookie('tkn', jwtToken, { secure: true, httpOnly: true, sameSite: 'None'})
            return res.status(RouteCode.SUCCESS.statusCode).json({message: 'OTP has shared successfully!'});
        }

        const newUser = new User({
            email: userEmail,
            name: 'User',
            password: 'User@1234',
            isActive: false,
            isAdmin: false,
            isMember: true,
            isEmailVerified: false,
            userRole: "Client"
        })

        await newUser.save();
        await sendOTPforLogin(newUser._id, newUser.email);
        // Set a Cookie to validate the User
        const jwtToken = jwt.sign({ email: newUser.email }, JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('tkn', jwtToken, { secure: true, httpOnly: true, sameSite: 'None'});
        return res.status(RouteCode.SUCCESS.statusCode).json({message: 'OTP has shared successfully!'});
    } catch (err) {
        console.log(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({message: 'Invalid or expired token'});
    }
};
const putValidateOTP = async (req, res) => {
    const userID = req.user;
    const { otp } = req.body;
    try {
        let foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'User not found, Try again!' });
        }

        const { isValid, statusCode, message } = await validateOTP(userID, otp)

        if(isValid){
            foundUser.isActive = true;
            foundUser.isEmailVerified = true;

            await foundUser.save();
            return res.status(statusCode).json(foundUser._id)
        } else {
            return res.status(statusCode).json({message: message})
        }
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }

};
// Booking Creation
async function getServiceName(serviceID, type) {
    if(type === 'service'){
        const service = await Service.findById(serviceID).populate('serviceID');
        if(service) return service.serviceID.name
    } else {
        const service = await ServiceItem.findById(serviceID);
        if(service) return service.name
    }
    return false
};
const postPublicServiceBooking = async (req, res) => {
    const reqUserID = req.user;
    const { userID, userName, userPhone, bookingDate, bookingTime, isCustomizable, message, centerID, serviceID, servicePrice, serviceAddons, totalDiscountedPrice, totalPrice } = req.body;

    try{
        const foundCenter = await Center.findById(centerID);
        const foundUser = await User.findById(reqUserID)
        const foundSimilarNumber = await User.findOne({phone: userPhone})
        if (!foundUser || !foundCenter) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: `${!foundCenter ? 'Center' : 'User'} not found, Try later!`});
        }
        

        foundUser.name = foundUser.name === 'User' ? userName : foundUser.name;
        if (!foundSimilarNumber) foundUser.phone = !foundUser.phone || foundUser.phone === '' ? userPhone : foundUser.phone;
        await foundUser.save();

        const newBooking = new Booking({
            user: foundUser._id,
            userName: userName,
            userPhone: userPhone,
            centerID: centerID,
            serviceID: serviceID,
            servicePrice: servicePrice,
            isCustomizable: isCustomizable,
            bookingDate: new Date(bookingDate),
            bookingTime: bookingTime,
            isReschedules: false,
            totalAmount: totalDiscountedPrice,
            discount: 0,
            status: 'Pending',
            paymentStatus: 'Unpaid',
            message: message,
            isPublicBooking: true,
            serviceAddons: serviceAddons ? serviceAddons.map(item => {
                return { addonID: item.addonID, addonPrice: item.addonDiscPrice };
            }) : []
        });

        newBooking.bookingLog.push({bookingDate: new Date(bookingDate), bookingTime: bookingTime,})
        await newBooking.save();

        let serviceNameList = [];
        
        serviceNameList.push(await getServiceName(serviceID, 'service'));
        if (serviceAddons) {
            for (const item of serviceAddons) {
                serviceNameList.push(await getServiceName(item.addonID, 'addon'));
            }
        }

        serviceNameList = serviceNameList.filter(item => item !== false);
        await handleBookingCreation(foundCenter.name, userName, foundUser.email, userPhone, serviceNameList, newBooking._id, bookingDate, bookingTime, message) 

        // Invoke auto refresh event on frontend
        io.to(centerID).emit('refreshBookings');
        res.status(RouteCode.SUCCESS.statusCode).json(newBooking._id)        
    } catch(err){
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const getPublicBookingList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ 
                message: `Unauthorized access, Try later!` 
            });
        }

        const foundBookings = await Booking.find({ user: userID })
            .populate({
                path: 'serviceID',
                select: 'serviceID',
                populate: {
                    path: 'serviceID',
                    model: 'ServiceItem',
                    select: 'name'
                }
            })
            .populate({
                path: 'serviceAddons.addonID',
                model: 'ServiceItem',
                select: 'name'
                })
            .sort({ createdAt: -1 });

        const bookingList = (foundBookings || []).map(item => {
            return {
                id: item._id,
                clientName: item.userName || 'Unknown',
                clientNumber: item.userPhone || 'N/A',
                appointmentDate: item.bookingDate || 'Not specified',
                appointmentTime: item.bookingTime || 'Not specified',
                totalAmount: item.totalAmount || 0,
                message: item.message || '',
                status: item.status || 'Pending',
                serviceID: item.serviceID?.serviceID?._id,
                serviceName: item.serviceID?.serviceID?.name || 'Unknown Service',
                isRescheduled: item.isReschedules || false,
                addonList: item.serviceAddons?.map(addon => {
                    if (addon.addonID) { 
                        return {
                            addonID: addon.addonID._id,
                            addonName: addon.addonID.name,
                        };
                    }
                    return null;
                }).filter(Boolean),
            };
        });

        res.status(RouteCode.SUCCESS.statusCode).json(bookingList);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getPublicBookingDetail = async (req, res) => {
    const { bookingID } = req.params;
    try {
        const foundBooking = await Booking.findById(bookingID)
            .populate({
                path: 'serviceID',
                select: 'serviceID',
                populate: {
                    path: 'serviceID',
                    model: 'ServiceItem',
                    select: 'name'
                }
            })
            .populate({
                path: 'serviceAddons.addonID',
                model: 'ServiceItem',
                select: 'name'
            });
    
        const bookingDetail = {
            id: foundBooking._id,
            clientName: foundBooking.userName || 'Unknown',
            clientNumber: foundBooking.userPhone || 'N/A',
            appointmentDate: foundBooking.bookingDate || 'Not specified',
            appointmentTime: foundBooking.bookingTime || 'Not specified',
            totalAmount: foundBooking.totalAmount || 0,
            message: foundBooking.message || '',
            status: foundBooking.status || 'Pending',
            serviceID: foundBooking.serviceID?.serviceID?._id,
            serviceName: foundBooking.serviceID?.serviceID?.name || 'Unknown Service',
            isRescheduled: foundBooking.isReschedules || false,
            addonList: foundBooking.serviceAddons?.map(addon => {
                if (addon.addonID) { 
                    return {
                        addonID: addon.addonID._id,
                        addonName: addon.addonID.name,
                    };
                }
                return null;
            }).filter(Boolean),
        };

        res.status(RouteCode.SUCCESS.statusCode).json(bookingDetail);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
}



// Admin Booking Controller
const getBookingAPIData = async (req, res) => {
    try {
        const foundServices = await ServiceItem.find();    
        const serviceList = foundServices?.length > 0  ? foundServices?.map(item => {return { id: item._id, name: item.name }}) : [];
        return res.status(RouteCode.SUCCESS.statusCode).json(serviceList);
    } catch (err) {
        console.error('Error retrieving service list:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getBookingList = async (req, res) => {
    const userID = req.user;
    const { centerID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        const foundCenter = await Center.findById(centerID);

        if (!foundUser || !foundCenter) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ 
                message: `${foundCenter ? 'Something went wrong' : 'Unauthorized access'}, Try later!` 
            });
        }

        const foundBookings = await Booking.find({ centerID: centerID })
            .populate({
            path: 'serviceID',
            select: 'serviceID',
            populate: {
                path: 'serviceID',
                model: 'ServiceItem',
                select: 'name'
            }
            })
            .populate({
            path: 'serviceAddons.addonID',
            model: 'ServiceItem',
            select: 'name'
            })
            .sort({ createdAt: -1 });

        const bookingList = [];
        const backendBookingList = [];
    
        foundBookings.forEach(item => {
            const bookingObject = {
                id: item._id,
                clientName: item.userName || 'Unknown',
                clientNumber: item.userPhone || 'N/A',
                appointmentDate: item.bookingDate || 'Not specified',
                appointmentTime: item.bookingTime || 'Not specified',
                totalAmount: item.totalAmount || 0,
                message: item.message || '',
                status: item.status || 'Pending',
                serviceID: item.serviceID?.serviceID?._id,
                serviceName: item.serviceID?.serviceID?.name || 'Unknown Service',
                isRescheduled: item.isReschedules || false,
                createdAt: item.createdAt,
                addonList: item.serviceAddons?.map(addon => {
                    if (addon.addonID) {
                        return {
                            addonID: addon.addonID._id,
                            addonName: addon.addonID.name,
                        };
                    }
                    return null;
                }).filter(Boolean),
                vehicleNo: item.vehicleNo || 'N/A'
            };

            if (item.isPublicBooking) {
                bookingList.push(bookingObject);
            } else {
                backendBookingList.push(bookingObject);
            }
        });

        const responseObj = {
            bookingList,
            backendBookingList
        };

        res.status(RouteCode.SUCCESS.statusCode).json(responseObj);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putRescheduleBooking = async (req, res) => {
    const userID = req.user;
    const { id, newDate, newTime } = req.body;
    try{
        const foundUser = await User.findById(userID);
        const foundBooking = await Booking.findById(id).populate('centerID');

        if (!foundUser || !foundBooking) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: `${!foundBooking ? 'Booking' : 'User'} not found, Try later!`});
        }
        
        foundBooking.bookingDate = new Date(newDate) || foundBooking.bookingDate;
        foundBooking.bookingTime = newTime || foundBooking.bookingTime;
        foundBooking.isReschedules = true;
        foundBooking.status = 'Rescheduled';
        foundBooking.bookingLog.push({
            bookingDate: new Date(newDate),
            bookingTime: newTime
        })

        await foundBooking.save();
        await handleBookingReschedule(foundBooking.centerID.name, foundBooking.userName, foundUser.email, newDate, newTime, foundBooking._id); 
        res.status(RouteCode.SUCCESS.statusCode).json({message: 'Booking has rescheduled successfully!'})        
    } catch(err){
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const putBookingStatusUpdate = async (req, res) => {
    const userID = req.user;
    const { id, statusID } = req.body;
    try{
        const foundUser = await User.findById(userID);
        const foundBooking = await Booking.findById(id).populate('centerID');;
        if (!foundUser || !foundBooking) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: `${!foundBooking ? 'Booking' : 'User'} not found, Try later!`});
        }
        
        foundBooking.status = statusID || 'Pending';
        await foundBooking.save();

        await handleBookingStatusUpdate(foundBooking.centerID.name, foundBooking.userName, foundUser.email, statusID, foundBooking._id); 
        res.status(RouteCode.SUCCESS.statusCode).json({message: 'Booking Status has updated successfully!'})        
    } catch(err){
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const getServiceList = async (req, res) => {
    const userID = req.user;
    const { centerID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        const foundCenter = await Center.findById(centerID);

        if(!foundUser || !foundCenter){
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Unauthorized access, Try later!'})
        }

        const foundServiceList = await Service.find({ centerID: foundCenter._id, isAvailable: true })
            .populate({ path: 'serviceID', select: 'name',})
            .populate({ path: 'addons.addonID', select: 'name description' })
            .exec();

        const serviceList = foundServiceList?.map(item => {
            return {
                id: item._id,
                serviceID: item.serviceID,
                serviceName: item.serviceID.name,
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

        return res.status(RouteCode.SUCCESS.statusCode).json(finalServiceList);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
// async function handleUserCreationthroughAdmin(userEmail, userPhone, userName){
//     let foundUser = await User.findOne({ email: userEmail });
//     if (!foundUser && userPhone) { // Run this when no user found with email
//         foundUser = await User.findOne({ phone: userPhone });
//     }

//     if (!foundUser) { // Run this when no user found with email and phone
//         const newUser = new User({
//             name: userName,
//             email: userEmail,
//             phone: userPhone,
//             password: 'User@1234',
//             isActive: false,
//             isAdmin: false,
//             isMember: true,
//             isEmailVerified: false,
//             userRole: 'Client',
//         });
//         await newUser.save();
//         return newUser
//     }

//     return foundUser;
// }
const postAdminServiceBooking = async (req, res) => {
    const userID = req.user;
    const { serviceID, centerID, servicePrice, serviceAddons, isCustomizable, totalDiscountedPrice, totalPrice, vehicleNo } = req.body;
    
    try{
        const foundCenter = await Center.findById(centerID);
        const foundAdmin = await User.findById(userID);
        if (!foundAdmin || !foundCenter) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: `${!foundCenter ? 'Center not found' : 'Unauthorized access'}, Try later!`});
        }

        const newBooking = new Booking({
            user: userID,
            userName: 'Default User',
            userPhone: '9898989898',
            centerID: centerID,
            serviceID: serviceID,
            servicePrice: servicePrice,
            isCustomizable: isCustomizable,
            bookingDate: new Date(),
            bookingTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
            isReschedules: false,
            totalAmount: totalDiscountedPrice,
            discount: 0,
            status: 'Confirmed',
            paymentStatus: 'Unpaid',
            message: 'NA',
            isPublicBooking: false,
            vehicleNo: vehicleNo,
            serviceAddons: serviceAddons ? serviceAddons.map(item => {
                return { addonID: item.addonID, addonPrice: item.addonDiscPrice };
            }) : []
        });
        
        newBooking.bookingLog.push({bookingDate: new Date(), bookingTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })})
        await newBooking.save();
        res.status(RouteCode.SUCCESS.statusCode).json({message: 'New Booking has created successfully!'});        
    } catch(err){
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const deleteBooking = async (req, res) => {
    const userID = req.user;
    const { centerID: bookingID } = req.params;
    try{
        const foundAdmin = await User.findById(userID);
        const foundBooking = await Booking.findById(bookingID);
        if (!foundAdmin || !foundBooking) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: `${!foundBooking ? 'Booking not found' : 'Unauthorized access'}, Try later!`});
        }


        await foundBooking.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Booking has deleted successfully!'})
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}




export default {
    postValidateEmail, putValidateOTP,
    postPublicServiceBooking, getPublicBookingList, getPublicBookingDetail,

    // Admin Booking
    getBookingAPIData, getBookingList, putRescheduleBooking, putBookingStatusUpdate,
    getServiceList, postAdminServiceBooking, deleteBooking
}