import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import CONSTANT from '../constant/constant.js';
import MAILER from '../helper/nodemailer.js';
import User from "../modal/user.js";

dotenv.config();
const { RouteCode } = CONSTANT;
const {  SALT } = process.env;

// GET List Controller
const getMemberList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const memberList = await User.find({isAdmin: false}).sort({ createdAt: -1 });

        const foundUsers = (memberList || []).map(user => ({
            id: user._id,
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone,
            userAddress: user.address,
            totalAmount: 0,
            isActive: user.isActive
        }));

      return res.status(RouteCode.SUCCESS.statusCode).json(foundUsers);
    } catch (err) {
      console.error(err);
      res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
// POST Controller
const postMember = async (req, res) => {
    const userID = req.user;
    const {  id, name, phone, email, address, password, confirmPassword } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }
        
        let hasEmail = await User.findOne({ email: userEmail });
        if (hasEmail) {
            return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Email already exists!' });
        }

        let hasPhone = await User.findOne({ phone: userPhone });
        if (hasPhone) {
            return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Phone already exists!' });
        }


        const hashedPassword = await bcrypt.hash(password.toString(), Number(SALT));
        
        const newUser = new User({
            name: name,
            email,
            phone,
            password: hashedPassword,
            isAdmin: false,
            address: address,
            isActive: true,
        })

        await MAILER.sendAccountCreatedNotification(name, password, email);
        await newUser.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Member has created successfully!'});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }

};
// GET Controller
const getInitMember = async (req, res) => {
    const { customerID } = req.params;
    const userID = req.user;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const member = await User.findById(customerID);
        if (!member) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        const userDetails = {
            id: member._id,
            name: member.name ?? '',
            email: member.email ?? '',
            phone: member.phone ?? '',
            address: member.address ?? '',
        }

        return res.status(RouteCode.SUCCESS.statusCode).json(userDetails)
    }
    catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
// PUT Controller
const putMemberDetail = async (req, res) => {
    const userID = req.user;
    const { id, name, phone, email, address } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        let member = await User.findById(id);
        if (!member) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: RouteCode.NOT_FOUND.message });
        }
        
        if(member.email !== email){
            const foundEmail = await User.findOne({email: email});
            if(foundEmail){
                return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Email already exists!'})
            }
        }

        if(member.phone !== phone){
            const foundPhone = await User.findOne({phone: phone});
            if(foundPhone){
                return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Mobile Number already exists!'})
            }
        }

        member.name = name || member.name;
        member.email = email || member.email;
        member.phone = phone || member.phone;
        member.address = address || member.address;

        member.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Member details has updated successfully!'});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }

};
const putMemberStatus = async (req, res) => {
    const userID = req.user;
    const { customerID, value } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const user = await User.findById(customerID);
        if (!user) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        user.isActive = value;
        await user.save();
        res.status(RouteCode.SUCCESS.statusCode).json({ message: `User has ${value ? 'Activated' : 'InActivated'} successfully` });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
// Delete Controller
const deleteMember = async (req, res) => {
    const userID = req.user;
    const { customerID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        // Find the User
        const member = await User.findById(customerID);
        if (!member) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        await member.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Member has deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


export default {
    getMemberList,
    postMember,  getInitMember, putMemberDetail, putMemberStatus, deleteMember
}