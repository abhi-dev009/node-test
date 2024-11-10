import { userResendOtp } from "../controllers/user";

const STRINGS = {
  EXPRESS_RUNNING: "Express Server running in ",
  somethingWrong: "Something went wrong!",
  auth: {},
};
const VALIDATIONS = {
  emailPassword: "please enter Email & Password",
  invalidEmailPassword: "invalid email or password",
  validEmailPassword: "please enter valid email and password",
  logout: "user logged out successfully",
};

const MESSAGES = {
  auth: {
    signup: "User created successfully!",
    changePassword: "User change password successfully!",
    login: "User logged in successfully!",
    webUserLogin: "Web existing User try to login",
    verifyUserOtp: "otp verification successfully!",
    forgotPassword: "otp sent successfully!",
    resetPassword: "password reset successfully!",
  },
  store: {
    nearestStoreCategories: "fetch store and category successfully!",
    settings: "fetch all settings successfully!",
    cityArea: "fetch city area successfully!",
    menuListByArea: "fetch menu list by area successfully!",
    toppingByOfferItemId: "fetch toppings by offer item and area successfully!",
    customizationByCategory: "fetch customization by category successfully!",
  },
  user: {
    createUserAddress: "User Address created successfully!",
    getUserAddressByUserId: "fetch all Address by user id successfully!",
    getProductListByOfferId: "fetch all product by offer id successfully!",
    getPaymentModesByArea: "fetch all payment mode by area id successfully!",
    getUserAddressById: "fetch Address by id successfully!",
    deleteUserAddressByUserId: "deletes all Address by user id successfully!",
    deleteUserAddressById: "delete Address by id successfully!",
    updateUserAddressById: "update Address by id successfully!",
    applyCoupon: "Coupon applied successfully!",
    createOrder: "Create order successfully!",
    userCouponsListByAreaId: "fetch user coupons list by area id successfully!",
    userOrderPriceCalculation:
      "fetch user order price calculation successfully!",
    userResendOtp: "user resend otp successfully!",
    userUpdate: "User update successfully!",
    userMyOrders: "fetch user order List successfully!",
    getUserRefferalCodeAndLoyaltypoint:
      "fetch User Refferal Code And Loyalty point successfully!",
    userEmailVerificationOtp: "email otp send successfully!",
  },
  bussinessInfo: {
    getAboutUsList: "fetch all About Us successfully!",
    getPrivacyPolicyList: "fetch all Privacy Policy successfully!",
    getTermsAndConditionsList: "fetch all Terms And Conditions successfully!",
    createContactUsForm: "contact us form created successfully!",
  },
};

enum Status {
  ERROR,
  SUCCESS,
}

export { STRINGS, VALIDATIONS, MESSAGES, Status };
