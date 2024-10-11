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

dotenv.config();
const { RouteCode } = constant;
const { handleLoginOTP, handleBookingCreation } = MAILER;
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
            phone: '',
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
        await handleBookingCreation(foundCenter.name, userName, foundUser.email, userPhone, serviceNameList, bookingDate, bookingTime, message) 
        res.status(RouteCode.SUCCESS.statusCode).json(newBooking._id)        
    } catch(err){
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}

export default {
    postValidateEmail, putValidateOTP,
    postPublicServiceBooking,
}