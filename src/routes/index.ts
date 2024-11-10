import AuthRoute from "./auth";
import StoreRoute from "./store";
import UserRoute from "./user";
import BusinessInfoRoute from "./businessInfo";

const ALL_ROUTES = [AuthRoute, StoreRoute, UserRoute, BusinessInfoRoute];

const API_VERSION = "/api/v1/";

// const ROUTES = {
//   MAIN_ROUTES: {
//     auth: "auth",
//     // blogs: { api: "/api/blogs" },
//   },
//   ENDPOINTS_ROUTES: {
//     auth: {
//       login: "login",
//       signup: "signup",
//       forgotPassword: "forgotPassword",
//       resetPassword: "forgotPassword",
//       currentUser: "currentUser",
//     // blogs: { api: "/" },
//   },
// };

// export { ALL_ROUTES, API_VERSION, ROUTES };
export { ALL_ROUTES, API_VERSION };
