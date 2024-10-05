import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const {NODEMAILER_EMAIL, NODEMAILER_PASSWORD, FRONTEND_URL} = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
});


// Auth
function generatePasswordResetNotification(name, email, resetLink) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h1 style="text-align: center; color: #4CAF50;">Password Reset Request</h1>
        <p style="text-align: right; font-size: 14px; color: #777;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>We received a request to reset your password for your account (ID: ${email}) at <strong>Our Washing Center</strong>.</p>
        
        <p>To reset your password, please click the link below:</p>
        
        <p style="text-align: center;">
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
        </p>
        
        <p>This link will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>

        <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
        
        <p style="margin-top: 40px;">Best Regards,</p>
        <p><strong>Washing Center</strong></p>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
        © ${new Date().getFullYear()} Washing Center. All rights reserved.
      </p>
    </div>
  `;
}
async function handleResetPassword(name, email, url){
  transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: generatePasswordResetNotification(name, email, url),
    }, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    }
  );
}


function generateAccountCreatedNotification(name, email, otp) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h1 style="text-align: center; color: #4CAF50;">Account Created Successfully</h1>
        <p style="text-align: right; font-size: 14px; color: #777;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>We are excited to inform you that your account has been successfully created at <strong>Our Washing Center</strong>.</p>
        
        <p>Your username is:</p>
        
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Username:</strong> ${email}</li>
        </ul>

        <p>For security purposes, please verify your email address using the One-Time Password (OTP) provided below:</p>
        <p style="font-size: 18px; font-weight: bold; color: #4CAF50;">OTP: ${otp}</p>

        <p>We recommend changing your password after logging in for the first time for better security.</p>

        <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
        
        <p style="margin-top: 40px;">Best Regards,</p>
        <p><strong>Washing Center</strong></p>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
        © ${new Date().getFullYear()} Washing Center. All rights reserved.
      </p>
    </div>
  `;
}
async function handleAccountOTPValidation(name, userEmail, otp) {
  transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to: userEmail,
      subject: `${otp} is your OTP for Account Verification at Washing Center`,
      html: generateAccountCreatedNotification(name, userEmail, otp),
    }, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    }
  );
}

// Center
function generateCenterCreatedNotification(userName, centerName, centerEmail) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
        <h1 style="text-align: center; color: #4CAF50;">Congratulations on Your New Washing Center!</h1>
        <p style="text-align: right; font-size: 14px; color: #777;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        
        <p>Dear <strong>${userName}</strong>,</p>
        
        <p>We are thrilled to announce that your washing center, <strong>${centerName} <small>(${centerEmail})</small> </strong>, has been successfully created!</p>
        
        <p>Your center is now part of our network, and we look forward to supporting you in providing top-notch services to your customers.</p>

        <p>If you have any questions or require assistance, feel free to reach out to our support team.</p>
        
        <p style="margin-top: 40px;">Best Regards,</p>
        <p><strong>Washing Center Team</strong></p>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
        © ${new Date().getFullYear()} Washing Center. All rights reserved.
      </p>
    </div>
  `;
}

async function handleCenterCreationNotification(centerName, userName, centerEmail) {
  transporter.sendMail({
      from: NODEMAILER_EMAIL,
      to: centerEmail,
      subject: `Congratulations on Your New Washing Center: ${centerName}!`,
      html: generateCenterCreatedNotification(userName, centerName, centerEmail),
    }, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    }
  );
}



export default {
  handleAccountOTPValidation,
  handleResetPassword,
  handleCenterCreationNotification,
  
}