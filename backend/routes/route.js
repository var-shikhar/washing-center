import express from "express";
import authController from '../controller/auth.js';
import centerController from '../controller/center.js';
import serviceController from '../controller/service.js';
import bookingController from '../controller/booking.js';


import memberController from '../controller/member.js';

import { isAuth } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route('/auth/register').post(authController.postRegister).put(isAuth, authController.putValidateOTP).get(isAuth, authController.getResendOTP)
router.route('/auth/login').post(authController.postLogin).get(isAuth, authController.getUserContext);
router.route('/auth/logout').get(isAuth, authController.getLogout);
router.route('/auth/forgotPassowrd').post(authController.postForgotPassword).put(authController.putResetPassword);
router.route('/auth/center-list').get(isAuth, centerController.getAuthCenterList)

router.route('/admin/center').post(isAuth, centerController.postCenterForm).get(isAuth, centerController.getCenterList).put(isAuth, centerController.putCenterDetail);
router.route('/admin/center/:centerID').get(isAuth, centerController.getInitDetails).put(isAuth, centerController.putCenterStatus).delete(isAuth, centerController.deleteCenter);

router.route('/admin/service/api').get(isAuth, serviceController.getAPIServiceForm);
router.route('/admin/service/list/:centerID').get(isAuth, serviceController.getServiceList);
router.route('/admin/service').post(isAuth, serviceController.postService).put(isAuth, serviceController.putServiceDetails)
router.route('/admin/service/:serviceID').get(isAuth, serviceController.getInitServiceForm).put(isAuth, serviceController.putServiceStatus).delete(isAuth, serviceController.deleteService);

router.route('/admin/booking/api').get(bookingController.getBookingAPIData)
router.route('/admin/booking/reschedule').put(isAuth, bookingController.putRescheduleBooking)
router.route('/admin/booking/:centerID?').get(isAuth, bookingController.getBookingList).put(isAuth, bookingController.putBookingStatusUpdate).delete(isAuth, bookingController.deleteBooking);
router.route('/admin/booking/service/:centerID?').get(isAuth, bookingController.getServiceList).post(isAuth, bookingController.postAdminServiceBooking)

router.route('/admin/dashboard-data/:centerID').get(isAuth, centerController.getCenterDashboardData);

// Public Controller
router.route('/public/center/list/:lat/:long/:radius').get(centerController.getPublicCenterList);
router.route('/public/center/service/:centerID').get(centerController.getCenterServices);

router.route('/public/auth/validateEmail').post(bookingController.postValidateEmail).put(isAuth, bookingController.putValidateOTP);
router.route('/public/service/booking').get(isAuth, bookingController.getPublicBookingList).post(isAuth, bookingController.postPublicServiceBooking);
router.route('/public/service/booking/:bookingID').get(bookingController.getPublicBookingDetail)





// Old Routes Begins here
router.route('/admin/customer').post(isAuth, memberController.postMember).put(isAuth, memberController.putMemberDetail).get(isAuth, memberController.getMemberList);
router.route('/admin/customer/:customerID').get(isAuth, memberController.getInitMember).put(isAuth, memberController.putMemberStatus).delete(isAuth, memberController.deleteMember);


// Public Routes
router.route('/public/auth/login').post(authController.postLogin);
router.route('/public/auth/logout').get(isAuth, authController.getLogout);
router.route('/public/auth/register').post(authController.postRegister);

router.route('/public/auth/forgot-password').post(authController.postForgotPassword);
router.route('/public/auth/password-update').post(authController.putResetPassword);


router.use('/', async (req, res) => {
    console.log(req.originalUrl);
    return res.send({ message: 'Undefined Request URL' })
})

export default router;