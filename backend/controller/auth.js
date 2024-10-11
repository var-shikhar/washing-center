import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import CONSTANT from '../constant/constant.js';
import MAILER from '../helper/nodemailer.js';
import OTP from "../modal/otp.js";
import User from "../modal/user.js";

dotenv.config();
const { RouteCode } = CONSTANT;
const { JWT_SECRET_KEY, SALT, FRONTEND_URL } = process.env;


export async function generateOTP(userID) {
    let latestOTP = null;
    let isUnique = false;
    try {
        await OTP.deleteMany({ expiryTime: { $lt: Date.now() } });

        while (!isUnique) {
            latestOTP = Math.floor(100000 + Math.random() * 900000);
            const foundOTP = await OTP.findOne({ otp: latestOTP });

            if (!foundOTP) {
                const newOTP = new OTP({
                    userID: userID,
                    otp: latestOTP,
                    expiryTime: Date.now() + 15 * 60 * 1000, // 15 minutes expiry
                });

                await newOTP.save();
                isUnique = true; // Mark as unique
            }
        }
    } catch (error) {
        console.error("Error during OTP generation:", error);
        throw new Error("Could not generate OTP. Please try again.");
    }

    return latestOTP.toString();
}
export async function validateOTP(userID, userInputOTP) {
    const foundOTPs = await OTP.find({ userID: userID });
    
    if (Array.isArray(foundOTPs) && foundOTPs.length > 0) {
        for (const otpEntry of foundOTPs) {
            const { otp, expiryTime } = otpEntry;
            
            // Check if OTP is expired
            if (Date.now() > expiryTime) {
                await OTP.deleteOne({ userID: userID, otp: otp }); // Remove expired OTP
                return { isValid: false, statusCode: RouteCode.FORBIDDEN.statusCode, message: "OTP has expired." };
            }
            
            // Check if OTP is valid
            if (userInputOTP === otp) {
                await OTP.deleteOne({ userID: userID, otp: otp }); // Remove validated OTP
                return { isValid: true, statusCode: RouteCode.SUCCESS.statusCode, message: "OTP validated successfully." };
            }
        }
        
        // If no valid OTP found after checking all entries
        return { isValid: false, statusCode: RouteCode.CONFLICT.statusCode, message: "Invalid OTP." };
    } else {
        return { isValid: false, statusCode: RouteCode.NOT_FOUND.statusCode, message: "OTP not found. Try sending another one!" };
    }
}

const postRegister = async (req, res) => {
    const { name, email, phone, password, confirmPassword } = req.body;
    try {
        let hasEmail = await User.findOne({ email: email });
        if (hasEmail) {
            return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Email already exists!' });
        }

        let hasPhone = await User.findOne({ phone: phone });
        if (hasPhone) {
            return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Phone already exists!' });
        }

        if(password !== confirmPassword){
            return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Password does not match!' });
        }

        const hashedPassword = await bcrypt.hash(password.toString(), Number(SALT));
        
        const newUser = new User({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword,
            userRole: "Admin",
            isAdmin: false,
            isMember: false,
            isEmailVerified: false,
            isActive: false,
        })

        const sharedOTP = await generateOTP(newUser._id);
        await MAILER.handleAccountOTPValidation(name, email, sharedOTP);
        await newUser.save();

        const jwtToken = jwt.sign({ email: email }, JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('tkn', jwtToken, { secure: true, httpOnly: true, sameSite: 'None'});
        return res.status(RouteCode.SUCCESS.statusCode).json(newUser._id);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
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
            return res.status(statusCode).json({message: 'Account has been activated successfully!'})
        } else {
            return res.status(statusCode).json({message: message})
        }
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }

};
const getResendOTP = async (req, res) => {
    const userID = req.user;
    try {
        let foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'User not found, Try again!' });
        }

        const sharedOTP = await generateOTP(userID);
        await MAILER.handleAccountOTPValidation(foundUser.name, foundUser.email, sharedOTP);
        return res.status(RouteCode.SUCCESS.statusCode).json({message: 'OTP has been reshared successfully!'})
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
};
const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let validateUser = await User.findOne({ email: email });
        if (!validateUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Account not found, Try creating a new one!' });
        }

        // Check if password matches
        const isCorrectPassowrd = await bcrypt.compare(password.toString(), validateUser.password);
        if (!isCorrectPassowrd) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: 'Password is incorrect' });
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ email: validateUser.email }, JWT_SECRET_KEY, { expiresIn: '1d' });
        // Setting a cookie with domain and path options
        res.cookie('tkn', jwtToken, { secure: true, httpOnly: true, sameSite: 'None'});
        return res.status(RouteCode.SUCCESS.statusCode).json(validateUser._id);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }

};
const getLogout = async (req, res) => {
    try {
        const token = req.cookies.tkn;
        if (!token) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: RouteCode.UNAUTHORIZED.message });
        }

        res.clearCookie('tkn', { secure: true, httpOnly: true });

        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Logged-Out Successfully!' });
    } catch (err) {
        console.error('Error during logout:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'User with this email does not exist.'});
      }
  
      // Create a reset token (expires in 15 minutes)
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '15m' });
      const resetPasswordURL = `${FRONTEND_URL}/auth/reset-password?token=${token}`;
  
      await MAILER.handleResetPassword(user.name, user.email, resetPasswordURL);
      return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Reset mail has shared to the registered email!'});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
};
const putResetPassword = async (req, res) => {
    const { token, password, confirmPassword } = req.body;
    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'User not found, Try later!'});
      }

      if (password !== confirmPassword) {
        return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Password does not match!'});
      }

  
      user.password = await bcrypt.hash(password.toString(), Number(SALT));
      await user.save();
      return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Password has updated successfully!'});
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Reset link has expired. Please request a new link.'});
      }
      res.status(RouteCode.SERVER_ERROR.statusCode).json({message: 'Invalid or expired token'});
    }
};

// Context Route
const getUserContext = async (req, res) => {
    const userID = req.user;
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'User not found, Try later!'});
        }

        const userContext = {
            userID: user._id,
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone,
            userRole: user.userRole,
            isMember: user.isMember,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            centerList: []
        }

        return res.status(RouteCode.SUCCESS.statusCode).json(userContext);
    } catch (err) {
        console.log(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({message: 'Invalid or expired token'});
    }
};

export default {
    postRegister, putValidateOTP, getResendOTP,
    postLogin, getLogout,
    postForgotPassword, putResetPassword,
    getUserContext
}