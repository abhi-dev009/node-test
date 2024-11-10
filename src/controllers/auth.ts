import prisma from "../connector/connector";
import { STATUS_CODES } from "../constants";
import { MESSAGES, Status } from "../constants/string";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import {
  ChangePassword,
  ForgotPassword,
  LoginUser,
  ResetPassword,
  SignUp,
  VerifyOtp,
} from "../models/auth.model";
import { Request, Response, NextFunction } from "express";
import md5 from "md5";
import {
  changePasswordSchema,
  forgotPasswordByEmailSchema,
  forgotPasswordByMobileSchema,
  loginUserOtpByEmailSchema,
  loginUserOtpByMobileSchema,
  reigsterUserSchema,
  resetPasswordByEmailSchema,
  resetPasswordByMobileSchema,
  verifyUserOtpByMobileSchema,
} from "../schemas/schema";
import ErrorHandler from "../utils/errorHandler";
import sendEmail from "../utils/sendEmail";
import sendSMS from "../utils/sendSMS";
import {
  generateEmailForResetPasswordOtp,
  generateLoginOTPMessage,
  generateToken,
  generateUniqueCode,
} from "../utils/helper";

//Register a user
const registerUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let {
      name,
      password,
      mobile,
      deviceId,
      fcm_token,
      device_type,
      invited_referral_code,
    }: SignUp = req.body;

    let userCondition: any = [{ mobile: mobile }];

    const user: any = await prisma.users.findFirst({
      where: {
        OR: [...userCondition],
      },
    });

    if (user) {
      return next(
        new ErrorHandler(
          `User already exist with this mobile no. please try again with other mobile no`,
          200
        )
      );
    }

    const { error }: any = reigsterUserSchema.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      const loyalty_point = await prisma.loyalty_point.findFirst({
        where: {
          id: 1,
        },
        select: {
          download_app_point: true,
          service_active: true,
        },
      });
      let invitee_user_loyalty_point = 0;

      if (invited_referral_code != "") {
        if (loyalty_point && loyalty_point.service_active == false) {
          return res.status(STATUS_CODES.OK).send({
            message: `Currently Loyalty point Service is not active`,
            data: {
              service_active: false,
              valid_referral_code: false,
            },
            status: Status.ERROR,
          });
        } else {
          const invited_user: any = await prisma.users.findFirst({
            where: {
              referral_code: invited_referral_code,
            },
            select: {
              id: true,
              loyalty_point: true,
              shared_referral_code_count: true,
            },
          });

          console.log("invited_user", JSON.stringify(invited_user));

          if (!invited_user) {
            return res.status(STATUS_CODES.OK).send({
              message: `Invalid referral Code.`,
              data: {
                service_active: true,
                valid_referral_code: false,
              },
              status: Status.ERROR,
            });
          }

          let shared_referral_code_count =
            invited_user.shared_referral_code_count;
          const sharing_loyalty_point: any =
            await prisma.sharing_loyalty_point.findMany();

          let used_times_count = 0;
          let invited_user_loyalty_point = 0;

          for (let i = 0; i < sharing_loyalty_point.length; i++) {
            let loyalty = sharing_loyalty_point[i];
            used_times_count += loyalty.used_times;
            if (shared_referral_code_count < used_times_count) {
              invitee_user_loyalty_point =
                (loyalty.sharing_point * loyalty.share_percent_invitee) / 100;
              invited_user_loyalty_point =
                invited_user.loyalty_point +
                (loyalty.sharing_point * loyalty.share_percent_invited) / 100;
              break;
            }
          }

          if (
            invitee_user_loyalty_point == 0 &&
            invited_user_loyalty_point == 0
          ) {
            return res.status(STATUS_CODES.OK).send({
              message: `Invalid referral Code.`,
              data: {
                service_active: true,
                valid_referral_code: false,
              },
              status: Status.ERROR,
            });
          }

          const update_invited_user = await prisma.users.update({
            where: {
              id: invited_user.id,
            },
            data: {
              loyalty_point: invited_user_loyalty_point,
              shared_referral_code_count:
                invited_user.shared_referral_code_count + 1,
            },
          });
        }
      }

      const encryptedPassword = md5(password);

      const mobile_otp = +(1000 + Math.random() * 9999 + "").substring(0, 4);

      try {
        let smsMessage: string = generateLoginOTPMessage(mobile_otp);

        const response: any = await sendSMS({
          template_name: "LOGIN_OTP",
          message: smsMessage,
          mobile_no: mobile,
        });

        if (response.data && response.data.Status != "Success") {
          return next(new ErrorHandler(response.data.Description, 500));
        }

        let referral_code = generateUniqueCode(7);

        // ensure referral code should unique of each user
        let findUserByReferralCode = await prisma.users.findFirst({
          where: {
            referral_code,
          },
        });

        for (let i = 0; findUserByReferralCode; i++) {
          console.log("Regenerate referral code");
          referral_code = generateUniqueCode(7);
          findUserByReferralCode = await prisma.users.findFirst({
            where: {
              referral_code,
            },
          });
        }

        let data: any;
        let downloadAppLoyaltyPoint = loyalty_point?.service_active
          ? loyalty_point.download_app_point
          : 0;
        if (referral_code != "") {
          data = await prisma.users.create({
            data: {
              name,
              password: encryptedPassword,
              image: "",
              mobile,
              deviceId,
              fcm_token,
              device_type,
              mobile_otp,
              referral_code,
              loyalty_point:
                invitee_user_loyalty_point + downloadAppLoyaltyPoint,
              referral_code_used: true,
            },
            select: {
              id: true,
              email: true,
              mobile: true,
              name: true,
            },
          });
        } else {
          data = await prisma.users.create({
            data: {
              name,
              password: encryptedPassword,
              image: "",
              mobile,
              deviceId,
              fcm_token,
              device_type,
              mobile_otp,
              referral_code,
              loyalty_point: downloadAppLoyaltyPoint,
            },
            select: {
              id: true,
              email: true,
              mobile: true,
              name: true,
            },
          });
        }

        return res.status(STATUS_CODES.OK_WITH_CREATION).send({
          message: MESSAGES.auth.signup,
          data: data,
          status: Status.SUCCESS,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  }
);

//Verify User's OTP
const verifyUserOtp = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email_mobile, mobile_otp, is_email_login }: VerifyOtp = req.body;
    let condition: any = {};
    var error;
    if (!req.body.hasOwnProperty("is_email_login")) {
      return next(
        new ErrorHandler(
          "Please specify you are login through email or mobile",
          400
        )
      );
    }
    var error;
    if (!is_email_login) {
      condition = { mobile: email_mobile + "" };
      error = verifyUserOtpByMobileSchema.validate({
        email_mobile,
        mobile_otp,
      }).error;
    }

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      let user: any = await prisma.users.findFirst({
        where: {
          ...condition,
        },
        select: {
          mobile_otp: true,
          id: true,
          name: true,
          mobile: true,
          email: true,
          referral_code: true,
        },
      });

      if (!user) {
        return next(
          new ErrorHandler(
            "Invalid mobile no",
            STATUS_CODES.UNAUTHORIZED_ACCESS
          )
        );
      } else if (user.mobile_otp != mobile_otp) {
        return next(
          new ErrorHandler(
            "Invalid mobile otp",
            STATUS_CODES.UNAUTHORIZED_ACCESS
          )
        );
      }

      const updateUser: any = await prisma.users.updateMany({
        data: {
          is_mobile_verified: true,
        },
        where: { ...condition },
      });

      if (updateUser.count == 0) {
        return next(new ErrorHandler("user not exists with this mobile", 400));
      } else {
        user = {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          is_email_verified: false,
          is_mobile_verified: true,
          referral_code: user.referral_code,
          token: generateToken(user.id),
        };
      }

      return res.status(STATUS_CODES.OK).send({
        message: MESSAGES.auth.verifyUserOtp,
        data: user,
        status: Status.SUCCESS,
      });
    }
  }
);

//Login User
const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email_mobile, password, is_email_login }: LoginUser = req.body;
    let condition: any = is_email_login
      ? { email: email_mobile }
      : { mobile: email_mobile };

    if (!req.body.hasOwnProperty("is_email_login")) {
      return next(
        new ErrorHandler(
          "Please specify you are login through email or mobile",
          400
        )
      );
    }
    var error;
    if (is_email_login) {
      error = loginUserOtpByEmailSchema.validate({
        email_mobile,
        password,
      }).error;
    } else {
      error = loginUserOtpByMobileSchema.validate({
        email_mobile,
        password,
      }).error;
    }

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      const user: any = await prisma.users.findFirst({
        where: {
          ...condition,
        },
        select: {
          id: true,
          name: true,
          mobile: true,
          password: true,
          email: true,
          is_email_verified: true,
          is_mobile_verified: true,
          mobile_otp: true,
          email_otp: true,
          referral_code: true,
        },
      });

      if (!user) {
        return next(
          new ErrorHandler(
            "Invalid email or password",
            STATUS_CODES.UNAUTHORIZED_ACCESS
          )
        );
      } else {
        user.token = generateToken(user.id);
      }

      if (user.password == "") {
        return res.status(STATUS_CODES.OK).send({
          message: MESSAGES.auth.webUserLogin,
          data: { existingWebUser: true },
          status: Status.SUCCESS,
        });
      }

      const isPasswordMatched = md5(password) == user.password;

      if (!isPasswordMatched) {
        return next(
          new ErrorHandler(
            "Invalid email or password",
            STATUS_CODES.UNAUTHORIZED_ACCESS
          )
        );
      }

      delete user["password"];

      if (user?.is_mobile_verified === false) {
        const mobile_otp = +(1000 + Math.random() * 9999 + "").substring(0, 4);
        const updatedUser = await prisma.users.update({
          data: {
            mobile_otp: mobile_otp,
          },
          where: { id: user.id },
          select: {
            id: true,
            name: true,
            mobile: true,
            email: true,
            is_email_verified: true,
            is_mobile_verified: true,
            mobile_otp: true,
            email_otp: true,
            referral_code: true,
          },
        });
        let smsMessage: string = generateLoginOTPMessage(mobile_otp);

        const response: any = await sendSMS({
          template_name: "LOGIN_OTP",
          message: smsMessage,
          mobile_no: email_mobile,
        });

        if (response.data && response.data.Status != "Success") {
          return next(new ErrorHandler(response.data.Description, 500));
        }
      }

      return res.status(STATUS_CODES.OK).send({
        message: MESSAGES.auth.login,
        data: { ...user, existingWebUser: false },
        status: Status.SUCCESS,
      });
    }
  }
);

//User Forgot Password
const forgotPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email_mobile, is_email_login }: ForgotPassword = req.body;
    let condition: any = is_email_login
      ? { email: email_mobile }
      : { mobile: email_mobile };

    if (!req.body.hasOwnProperty("is_email_login")) {
      return next(
        new ErrorHandler(
          "Please specify you are login through email or mobile",
          400
        )
      );
    }
    var error;
    if (is_email_login) {
      error = forgotPasswordByEmailSchema.validate({
        email_mobile,
      }).error;
    } else {
      error = forgotPasswordByMobileSchema.validate({
        email_mobile,
      }).error;
    }

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      const mobile_otp = +(1000 + Math.random() * 9999 + "").substring(0, 4);
      const email_otp = +(1000 + Math.random() * 9999 + "").substring(0, 4);
      const updateUser = await prisma.users.updateMany({
        data: {
          mobile_otp: mobile_otp,
          email_otp: email_otp,
        },
        where: { ...condition },
      });
      console.log("updateUser", updateUser);

      if (updateUser.count == 0) {
        return next(
          new ErrorHandler("user not exists with this email or mobile", 400)
        );
      }

      const data = await prisma.users.findFirst({
        where: {
          ...condition,
        },
        select: is_email_login
          ? {
              email_otp: true,
            }
          : {
              mobile_otp: true,
            },
      });

      if (is_email_login) {
        try {
          await sendEmail({
            email: email_mobile,
            subject: "Reset password OTP - Pizza Today",
            message: generateEmailForResetPasswordOtp(email_otp),
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      } else {
        let smsMessage: string = generateLoginOTPMessage(mobile_otp);

        const response: any = await sendSMS({
          template_name: "LOGIN_OTP",
          message: smsMessage,
          mobile_no: email_mobile,
        });

        if (response.data && response.data.Status != "Success") {
          return next(new ErrorHandler(response.data.Description, 500));
        }
      }

      if (!data) {
        return next(
          new ErrorHandler("user not exists with this email or mobile", 400)
        );
      }

      return res.status(STATUS_CODES.OK).send({
        message: MESSAGES.auth.forgotPassword,
        data: {},
        status: Status.SUCCESS,
      });
    }
  }
);

//User Reset Password
const resetPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email_mobile, is_email_login, new_password, otp }: ResetPassword =
      req.body;

    let condition: any = is_email_login
      ? { email: email_mobile }
      : { mobile: email_mobile };

    if (!req.body.hasOwnProperty("is_email_login")) {
      return next(
        new ErrorHandler(
          "Please specify you are login through email or mobile",
          400
        )
      );
    }
    var error;
    if (is_email_login) {
      error = resetPasswordByEmailSchema.validate({
        email_mobile,
        new_password,
        otp,
      }).error;
    } else {
      error = resetPasswordByMobileSchema.validate({
        email_mobile,
        new_password,
        otp,
      }).error;
    }

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      const user = await prisma.users.findFirst({
        where: {
          ...condition,
        },
      });

      if (!user) {
        return next(
          new ErrorHandler(
            "email/mobile number not register",
            STATUS_CODES.UNAUTHORIZED_ACCESS
          )
        );
      }

      if (
        (is_email_login && user.email_otp != otp) ||
        (!is_email_login && user.mobile_otp != otp)
      ) {
        return next(
          new ErrorHandler("invalid otp", STATUS_CODES.UNAUTHORIZED_ACCESS)
        );
      }

      const updateVerifiedInfo = is_email_login
        ? { is_email_verified: true }
        : { is_mobile_verified: true };

      const encryptedPassword = md5(new_password);

      let responseData = {
        existingWebUser: false,
        loyaltyPoint: 0,
      };
      if (user.password == "") {
        responseData.existingWebUser = true;
        const loyalty_point = await prisma.loyalty_point.findFirst({
          where: {
            id: 1,
          },
          select: {
            download_app_point: true,
            service_active: true,
          },
        });

        if (loyalty_point?.service_active) {
          responseData.loyaltyPoint = loyalty_point.download_app_point;
        }

        const updateUser = await prisma.users.update({
          data: {
            password: encryptedPassword,
            ...updateVerifiedInfo,
            loyalty_point: responseData.loyaltyPoint,
          },
          where: { id: user.id },
        });
      } else {
        const updateUser = await prisma.users.update({
          data: {
            password: encryptedPassword,
            ...updateVerifiedInfo,
          },
          where: { id: user.id },
        });
      }

      return res.status(STATUS_CODES.OK).send({
        message: MESSAGES.auth.resetPassword,
        status: Status.SUCCESS,
        data: responseData,
      });
    }
  }
);

//User Change Password
const changePassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      old_password,
      new_password,
      confirm_password,
      user_id,
    }: ChangePassword = req.body;

    const { error }: any = changePasswordSchema.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      const user = await prisma.users.findFirst({
        where: {
          id: user_id,
        },
        select: {
          password: true,
        },
      });

      if (!user) {
        return next(
          new ErrorHandler(
            "Invalid credentials. Try Again!",
            STATUS_CODES.UNAUTHORIZED_ACCESS
          )
        );
      }

      // Check if the old password matches the stored password
      const isPasswordMatched = md5(old_password) == user.password;

      if (!isPasswordMatched) {
        return next(
          new ErrorHandler(
            "Invalid credentials. Try Again!",
            STATUS_CODES.UNAUTHORIZED_ACCESS
          )
        );
      }

      const encryptedPassword = md5(new_password);
      // Update the password
      const updatedUser = await prisma.users.update({
        data: { password: encryptedPassword },
        where: { id: user_id },
        select: {
          id: true,
          name: true,
          mobile: true,
          email: true,
          is_email_verified: true,
          is_mobile_verified: true,
        },
      });

      // Send the response
      return res.status(STATUS_CODES.OK).send({
        message: MESSAGES.auth.changePassword,
        data: updatedUser,
        status: Status.SUCCESS,
      });
    }
  }
);

export {
  registerUser,
  verifyUserOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
};
