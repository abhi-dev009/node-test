import Joi from "joi";

// Define a validation schema for the request body
const reigsterUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  mobile: Joi.number()
    .integer()
    .min(10 ** 9)
    .max(10 ** 10 - 1)
    .required()
    .messages({
      "number.min": "Mobile number should be 10 digit.",
      "number.max": "Mobile number should be 10 digit",
    }),
  fcm_token: Joi.string().allow(null, ""),
  password: Joi.string().required(),
  deviceId: Joi.string().allow(null, ""),
  device_type: Joi.string().allow(null, ""),
  invited_referral_code: Joi.string().allow(""),
});
const contactUsFormSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().max(100).required(),
  mobile: Joi.number()
    .integer()
    .min(10 ** 9)
    .max(10 ** 10 - 1)
    .required()
    .messages({
      "number.min": "Mobile number should be 10 digit.",
      "number.max": "Mobile number should be 10 digit",
    }),
  subject: Joi.string().max(100).required(),
  message: Joi.string().allow(null, "").required(),
  user_id: Joi.number().required(),
});
const updateUserProfileSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  dob: Joi.string().required(),
  user_id: Joi.number().required(),
});
const verifyUserOtpByEmailSchema = Joi.object({
  email_mobile: Joi.string().email().required(),
  mobile_otp: Joi.number(),
  email_otp: Joi.number(),
});
const userEmailOtpSchema = Joi.object({
  user_id: Joi.number().required(),
  email: Joi.string().email().required(),
});
const verifyUserEmailOtpSchema = Joi.object({
  user_id: Joi.number().required(),
  email_otp: Joi.number().required(),
});
const verifyUserOtpByMobileSchema = Joi.object({
  email_mobile: Joi.number()
    .integer()
    .min(10 ** 9)
    .max(10 ** 10 - 1)
    .required()
    .messages({
      "number.min": "Mobile number should be 10 digit.",
      "number.max": "Mobile number should be 10 digit",
    }),
  mobile_otp: Joi.number(),
  email_otp: Joi.number(),
});
const resendOtpByEmailSchema = Joi.object({
  email_mobile: Joi.string().email().required(),
});
const resendOtpByMobileSchema = Joi.object({
  email_mobile: Joi.number()
    .integer()
    .min(10 ** 9)
    .max(10 ** 10 - 1)
    .required()
    .messages({
      "number.min": "Mobile number should be 10 digit.",
      "number.max": "Mobile number should be 10 digit",
    }),
});
const resetPasswordByEmailSchema = Joi.object({
  email_mobile: Joi.string().email().required(),
  new_password: Joi.string().required(),
  otp: Joi.number(),
});
const resetPasswordByMobileSchema = Joi.object({
  email_mobile: Joi.number()
    .integer()
    .min(10 ** 9)
    .max(10 ** 10 - 1)
    .required()
    .messages({
      "number.min": "Mobile number should be 10 digit.",
      "number.max": "Mobile number should be 10 digit",
    }),
  otp: Joi.number(),
  new_password: Joi.string().required(),
});
const forgotPasswordByEmailSchema = Joi.object({
  email_mobile: Joi.string().email().required(),
});
const forgotPasswordByMobileSchema = Joi.object({
  email_mobile: Joi.number()
    .integer()
    .min(10 ** 9)
    .max(10 ** 10 - 1)
    .required()
    .messages({
      "number.min": "Mobile number should be 10 digit.",
      "number.max": "Mobile number should be 10 digit",
    }),
});
const loginUserOtpByEmailSchema = Joi.object({
  email_mobile: Joi.string().email().required(),
  password: Joi.string().required(),
});
const loginUserOtpByMobileSchema = Joi.object({
  email_mobile: Joi.number()
    .integer()
    .min(10 ** 9)
    .max(10 ** 10 - 1)
    .required()
    .messages({
      "number.min": "Mobile number should be 10 digit.",
      "number.max": "Mobile number should be 10 digit",
    }),
  password: Joi.string().required(),
});
const nearestStoreCategoriesSchema = Joi.object({
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
});

const createUserAddressSchema = Joi.object({
  user_id: Joi.number().required(),
  address: Joi.string().required(),
  locality: Joi.string().required(),
  type: Joi.string().required().valid("billing", "shipping"),
});

const updateUserAddressSchema = Joi.object({
  address: Joi.string().required(),
  locality: Joi.string().required(),
  type: Joi.string().required().valid("billing", "shipping"),
});

const changePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
  confirm_password: Joi.any()
    .equal(Joi.ref("new_password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
  user_id: Joi.number().required(),
});

export {
  reigsterUserSchema,
  verifyUserOtpByEmailSchema,
  verifyUserOtpByMobileSchema,
  loginUserOtpByEmailSchema,
  loginUserOtpByMobileSchema,
  forgotPasswordByEmailSchema,
  forgotPasswordByMobileSchema,
  resetPasswordByEmailSchema,
  resetPasswordByMobileSchema,
  nearestStoreCategoriesSchema,
  createUserAddressSchema,
  updateUserAddressSchema,
  changePasswordSchema,
  resendOtpByEmailSchema,
  resendOtpByMobileSchema,
  contactUsFormSchema,
  updateUserProfileSchema,
  verifyUserEmailOtpSchema,
  userEmailOtpSchema,
};
