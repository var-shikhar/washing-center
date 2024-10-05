const BACKEND_ROUTE  = 'http://localhost:8080';

// Auth Routes
const commonRegisterRoute = `${BACKEND_ROUTE}/auth/register`;
const commonLoginRoute = `${BACKEND_ROUTE}/auth/login`;
const getLogoutRoute = `${BACKEND_ROUTE}/auth/logout`;
const commonForgotPasswordRoute = `${BACKEND_ROUTE}/auth/forgotPassowrd`;

// Center Routes
const authCenterRoute = `${BACKEND_ROUTE}/auth/center-list`;
const commonCenterRoute = `${BACKEND_ROUTE}/admin/center`;

const publicCenterRoute = `${BACKEND_ROUTE}/public/center`;
const publicCenterListRoute = `${BACKEND_ROUTE}/public/center/list`;



// Service Routes
const getAPIServiceForm = `${BACKEND_ROUTE}/admin/service/api`;
const commonServiceRoute = `${BACKEND_ROUTE}/admin/service`;
const getServiceList = `${BACKEND_ROUTE}/admin/service/list`;





const ROUTES = {
    commonRegisterRoute, commonLoginRoute, getLogoutRoute, commonForgotPasswordRoute,
    authCenterRoute, commonCenterRoute,
    getAPIServiceForm, commonServiceRoute, getServiceList,


    // Public Routes
    publicCenterRoute, publicCenterListRoute
}




export default ROUTES
