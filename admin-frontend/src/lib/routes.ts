const BACKEND_ROUTE = 'http://localhost:8080';

// Auth Routes
const commonRegisterRoute = `${BACKEND_ROUTE}/sa/auth/register`;
const commonLoginRoute = `${BACKEND_ROUTE}/sa/auth/login`;
const getLogoutRoute = `${BACKEND_ROUTE}/sa/auth/logout`;
const commonForgotPasswordRoute = `${BACKEND_ROUTE}/sa/auth/forgotPassowrd`;

// User Panel
const commonUserRoute = `${BACKEND_ROUTE}/sa/admin/users`;
const commonCenterRoute = `${BACKEND_ROUTE}/sa/admin/center`;

// Data Routes
const commonServiceRoute = `${BACKEND_ROUTE}/sa/admin/data/service`;
const getAPIServiceRoute = `${BACKEND_ROUTE}/sa/admin/data/service/api`;
const commonVehicleRoute = `${BACKEND_ROUTE}/sa/admin/data/vehicle`;
const commonCategoryRoute = `${BACKEND_ROUTE}/sa/admin/data/category`;

// Dashboard Routes
const getDashboardData = `${BACKEND_ROUTE}/sa/admin/dashboard`;



const ROUTES = {
    BACKEND_ROUTE,
    commonRegisterRoute, commonLoginRoute, getLogoutRoute, commonForgotPasswordRoute,
    commonUserRoute, commonCenterRoute,
    commonServiceRoute, getAPIServiceRoute,
    commonVehicleRoute, commonCategoryRoute,
    getDashboardData,
}




export default ROUTES
