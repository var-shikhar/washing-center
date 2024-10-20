import express from "express";
import authController from '../controller/auth.js';
import centerController from '../controller/center.js';
import serviceController from '../controller/service.js';
import bookingController from '../controller/booking.js';

// Super Admin Controllers
import usersController from '../controller/admin/users.js';
import adminCenterController from '../controller/admin/center.js';
import adminServiceController from '../controller/admin/service.js'
import adminVehicleController from '../controller/admin/vehicle.js';
import adminCategoryController from '../controller/admin/category.js'
import adminDashboardController from '../controller/admin/dashboard.js'


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



// Super Admin Controller
router.route('/sa/auth/register/:isMaster?').post(authController.postMasterUserRegister).put(isAuth, authController.putValidateOTP).get(isAuth, authController.getResendOTP)
router.route('/sa/auth/login').post(authController.postLogin).get(isAuth, authController.getMasterUserContext);
router.route('/sa/auth/logout').get(isAuth, authController.getLogout);
router.route('/sa/auth/forgotPassowrd').post(authController.postForgotPassword).put(authController.putResetPassword);

router.route('/sa/admin/dashboard').get(isAuth, adminDashboardController.getAdminDashboardData)

router.route('/sa/admin/users/:userId?').get(isAuth, usersController.getUsersList).delete(isAuth, usersController.deleteUser)
router.route('/sa/admin/center/:centerID?').get(isAuth, adminCenterController.getCenterList).post(isAuth, adminCenterController.postCenterListingStatus).put(isAuth, adminCenterController.putCenterStatus).delete(isAuth, adminCenterController.deleteCenter)

router.route('/sa/admin/data/service').get(isAuth, adminServiceController.getServiceList).post(isAuth, adminServiceController.postService).put(isAuth, adminServiceController.putServiceDetail)
router.route('/sa/admin/data/service/api').get(isAuth, adminServiceController.getAPIServiceForm)
router.route('/sa/admin/data/service/:serviceID').get(isAuth, adminServiceController.getInitService).delete(isAuth, adminServiceController.deleteService)

router.route('/sa/admin/data/vehicle').get(isAuth, adminVehicleController.getVehicleList).post(isAuth, adminVehicleController.postVehicle).put(isAuth, adminVehicleController.putVehicleDetail);
router.route('/sa/admin/data/vehicle/:vehicleID').get(isAuth, adminVehicleController.getInitVehicle).delete(isAuth, adminVehicleController.deleteVehicle);

router.route('/sa/admin/data/category').get(isAuth, adminCategoryController.getCategoryList).post(isAuth, adminCategoryController.postServiceCategory).put(isAuth, adminCategoryController.putServiceCategoryDetail);
router.route('/sa/admin/data/category/:categoryID').get(isAuth, adminCategoryController.getInitServiceCategory).delete(isAuth, adminCategoryController.deleteServiceCategory);




router.use('/', async (req, res) => {
    console.log(req.originalUrl);
    return res.send({ message: 'Undefined Request URL' })
})

export default router;