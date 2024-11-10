export default interface EmailOption {
  email: string;
  subject: string;
  message?: string;
}

export interface SMSOption {
  template_name: "PIZOPT" | "LOGIN_OTP" | "ORDER" | "COD";
  message: string;
  mobile_no: string;
}
