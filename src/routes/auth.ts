import express from "express";
import {
  changePassword,
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyUserOtp,
} from "../controllers/auth";
import isAuthenticatedUser from "../middleware/checkAuth";

const router = express.Router();
router.route("/register").post(registerUser);
router.route("/verifyUserOtp").post(verifyUserOtp);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, changePassword);

export default router;
