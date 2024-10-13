const BACKEND_ROUTE  = 'http://localhost:8080';

// Auth Routes
const commonRegisterRoute = `${BACKEND_ROUTE}/auth/register`;
const commonLoginRoute = `${BACKEND_ROUTE}/auth/login`;
const getLogoutRoute = `${BACKEND_ROUTE}/auth/logout`;
const commonForgotPasswordRoute = `${BACKEND_ROUTE}/auth/forgotPassowrd`;

// Center Routes
const authCenterRoute = `${BACKEND_ROUTE}/auth/center-list`;
const commonCenterRoute = `${BACKEND_ROUTE}/admin/center`;

// Service Routes
const getAPIServiceForm = `${BACKEND_ROUTE}/admin/service/api`;
const commonServiceRoute = `${BACKEND_ROUTE}/admin/service`;
const getServiceList = `${BACKEND_ROUTE}/admin/service/list`;

// Booking Routes
const getAPIBooking = `${BACKEND_ROUTE}/admin/booking/api`;
const commonBookingRoute = `${BACKEND_ROUTE}/admin/booking`;
const commonBookingRescheduleRoute = `${BACKEND_ROUTE}/admin/booking/reschedule`;
const commonAdminServiceBooking = `${BACKEND_ROUTE}/admin/booking/service`;


// Public Routes
const publicCenterListRoute = `${BACKEND_ROUTE}/public/center/list`;
const publicServiceListRoute = `${BACKEND_ROUTE}/public/center/service`;

// Public Booking
const publicCommonEmailValidation = `${BACKEND_ROUTE}/public/auth/validateEmail`;
const publicCommonServiceBooking = `${BACKEND_ROUTE}/public/service/booking`;





const ROUTES = {
    commonRegisterRoute, commonLoginRoute, getLogoutRoute, commonForgotPasswordRoute,
    authCenterRoute, commonCenterRoute,
    getAPIServiceForm, commonServiceRoute, getServiceList,
    getAPIBooking, commonBookingRoute, commonBookingRescheduleRoute, commonAdminServiceBooking,


    // Public Routes
    publicServiceListRoute, publicCenterListRoute,
    publicCommonEmailValidation, publicCommonServiceBooking
}




export default ROUTES
