interface SignUp {
  name: string;
  email?: string;
  mobile: string;
  deviceId?: string;
  device_type?: string;
  password: string;
  fcm_token?: string;
  invited_referral_code: string;
}

interface VerifyOtp {
  email_mobile?: string | number;
  mobile_otp: number;
  email_otp: number;
  is_email_login: boolean;
}

interface LoginUser {
  email_mobile: string;
  password: string;
  is_email_login: boolean;
}
interface ForgotPassword {
  email_mobile: string;
  is_email_login: boolean;
}
interface ResetPassword {
  email_mobile?: string;
  new_password: string;
  is_email_login: boolean;
  otp: number;
}
interface ResendOtp {
  email_mobile: string;
  is_email_login: boolean;
}
interface UpdateUserProfile {
  user_id: number;
  name: string;
  dob: string;
}
interface ChangePassword {
  old_password: string;
  new_password: string;
  confirm_password: string;
  user_id: number;
}
interface NearestStoreCategories {
  latitude: string;
  longitude: string;
}
interface CreateUserAddress {
  user_id: number;
  address: string;
  locality: string;
  email: string;
  full_name: string;
  mobile: string;
  type: "shipping" | "billing";
}

interface CreateOrder {
  area_id: number;
  city_id: number;
  user_id: number;
  coupon_code: string;
  discount: string;
  discount_amount: number;
  discount_type: string;
  sub_total: number;
  delivery_fee: number;
  tax: number;
  tax_amount: number;
  total: number;
  grand_total: number;
  payment_mode: string;
  order_type: string;
}
interface ContactUsForm {
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  user_id: number;
}

interface verifyUserEmailOtp {
  email_otp: number;
  user_id: number;
}
interface userEmailVerificationOtp {
  email: string;
  user_id: number;
}

export {
  SignUp,
  VerifyOtp,
  LoginUser,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
  NearestStoreCategories,
  CreateUserAddress,
  CreateOrder,
  ResendOtp,
  ContactUsForm,
  UpdateUserProfile,
  verifyUserEmailOtp,
  userEmailVerificationOtp,
};
