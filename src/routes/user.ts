import express from "express";
import {
  applyCoupon,
  userCouponsListByAreaId,
  createUserAddress,
  deleteUserAddressById,
  deleteUserAddressByUserId,
  getUserAddressById,
  getUserAddressByUserId,
  updateUserAddressById,
  userOrderPriceCalculation,
  userResendOtp,
  createCodOrder,
  createRazorPayOrder,
  updateUserProfile,
  initiateRazorpayOrderPayment,
  userMyOrders,
  getUserRefferalCodeAndLoyaltypoint,
  validateReferralCodeForSharing,
  checkLoyaltyPointService,
  verifyUserEmailOtp,
  getUserEmailVerificationOtp,
} from "../controllers/user";
import isAuthenticatedUser from "../middleware/checkAuth";
import { upload } from "../utils/helper";

const router = express.Router();

router.route("/user/address/new").post(isAuthenticatedUser, createUserAddress);
router
  .route("/user/address/:id")
  .get(isAuthenticatedUser, getUserAddressById)
  .delete(isAuthenticatedUser, deleteUserAddressById)
  .put(isAuthenticatedUser, updateUserAddressById);

router
  .route("/user/allAddressByUser/:id")
  .get(isAuthenticatedUser, getUserAddressByUserId)
  .delete(isAuthenticatedUser, deleteUserAddressByUserId);

router.route("/user/applyCoupon").post(isAuthenticatedUser, applyCoupon);
router.route("/user/userCouponsListByAreaId").post(userCouponsListByAreaId);
router.route("/user/userOrderPriceCalculation").post(userOrderPriceCalculation);
router.route("/user/userResendOtp").post(userResendOtp);
router.route("/user/createCodOrder").post(isAuthenticatedUser, createCodOrder);
router
  .route("/user/createRazorPayOrder")
  .post(isAuthenticatedUser, createRazorPayOrder);
router
  .route("/user/updateUserProfile")
  .post(upload.single("profile_pic"), updateUserProfile);
router
  .route("/user/initiateRazorpayOrderPayment")
  .post(isAuthenticatedUser, initiateRazorpayOrderPayment);
router.route("/user/myOrders/:id").get(isAuthenticatedUser, userMyOrders);
router
  .route("/user/getUserRefferalCodeAndLoyaltypoint/:id")
  .get(isAuthenticatedUser, getUserRefferalCodeAndLoyaltypoint);
router
  .route("/user/validateReferralCodeForSharing/:id")
  .get(isAuthenticatedUser, validateReferralCodeForSharing);
router.route("/user/checkLoyaltyPointService").get(checkLoyaltyPointService);
router.route("/user/getEmailVerificationOtp").post(getUserEmailVerificationOtp);
router.route("/user/verifyUserEmailOtp").post(verifyUserEmailOtp);

export default router;
