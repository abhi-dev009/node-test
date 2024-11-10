import axios from "axios";
import { SMSOption } from "../models/model";

const SMS_AUTH_KEY: any = process.env.SMS_AUTH_KEY;
const SMS_SENDER: any = process.env.SMS_SENDER;
const SMS_ROUTE: any = process.env.SMS_ROUTE;
const SMS_COUNTRY_CODE: any = process.env.SMS_COUNTRY_CODE;
const SMS_URL: any = process.env.SMS_URL;

const sendSMS = async (options: SMSOption) => {
  let DLT_TE_ID: any;
  switch (options.template_name) {
    case "LOGIN_OTP":
      DLT_TE_ID = process.env.SMS_LOGIN_OTP_DLT_TE_ID;
      break;
    case "ORDER":
      DLT_TE_ID = process.env.SMS_ORDER_DLT_TE_ID;
      break;
    default:
      // Handle cases where none of the above matches, if needed
      break;
  }

  const response = await axios.get(
    `${SMS_URL}?authkey=${SMS_AUTH_KEY}&mobiles=${options.mobile_no}&message=${options.message}&sender=${SMS_SENDER}&route=${SMS_ROUTE}&country=${SMS_COUNTRY_CODE}&DLT_TE_ID=${DLT_TE_ID}`
  );

  return response;
};

export default sendSMS;
