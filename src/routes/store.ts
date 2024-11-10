import express from "express";
import {
  getAllSettings,
  getCityArea,
  getCustomizationByArea,
  getMenuListByArea,
  getNearestStoreCategories,
  getPaymentModesByArea,
  getProductListByOfferId,
  getStoreCategoriesOfferByAreaId,
  getToppingByOfferItemId,
} from "../controllers/store";

const router = express.Router();
router.route("/getNearestStoreCategories").post(getNearestStoreCategories);
router.route("/getCityArea").get(getCityArea);
router.route("/getMenuListByArea/:id").get(getMenuListByArea);
router.route("/getCustomizationByArea/:id").get(getCustomizationByArea);
router.route("/getAllSettings").get(getAllSettings);
router
  .route("/getToppingByOfferItemId/:id/:areaId")
  .get(getToppingByOfferItemId);
router.route("/getPaymentModesByArea/:id").get(getPaymentModesByArea);
router
  .route("/getStoreCategoriesOfferByAreaId/:id")
  .get(getStoreCategoriesOfferByAreaId);
router.route("/getProductListByOfferId/:id").get(getProductListByOfferId);

export default router;
