import express from "express";
import {
  createContactUsForm,
  getAboutUsList,
  getPrivacyPolicyList,
  getTermsAndConditionsList,
} from "../controllers/businessInfo";

const router = express.Router();
router.route("/aboutUsList").get(getAboutUsList);
router.route("/privacyPolicyList").get(getPrivacyPolicyList);
router.route("/termsAndConditionsList").get(getTermsAndConditionsList);
router.route("/createContactUsForm").post(createContactUsForm);

export default router;
