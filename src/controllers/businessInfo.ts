import prisma from "../connector/connector";
import { STATUS_CODES } from "../constants";
import { MESSAGES, Status } from "../constants/string";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { Request, Response, NextFunction } from "express";
import { ContactUsForm } from "../models/auth.model";
import { contactUsFormSchema } from "../schemas/schema";
import ErrorHandler from "../utils/errorHandler";

const getAboutUsList = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // const createaboutUsList: any = await prisma.about_us.createMany({
    //   data: [
    //     {
    //       heading: "OVERVIEW",
    //       paragraph:
    //         "We are proud to Introduce ourselves as PizzaToday India™ brand run by PizzaToday Inndia Food & Beverages based at Singrauli, Madhya Pradesh. PizzaToday India™ is a proud Indian pizza chain & one of the leading Pizza Chain in India. Founded on 08 dec 2015. PizzaToday India™ is known for its Taste & Variety of Fresh Pizzas. PizzaToday India has a wide product portfolio of pizzas and its best in Vegetarian & Non vegetarian .",
    //     },
    //     {
    //       heading: "ABOUT CEO",
    //       paragraph:
    //         "The man standing behind the success of PizzaToday India™ is RAJESH KUMAR SONI who has a great passion for cooking. His vast experience in various business makes him a unique Entrepreneur, but his love for food Industry started from indian sub continent since 09 years and now he has applied all his expertise to his own venture and now his main aim is to benefit and to Inspire young generation who have flair to grow individually as a young Male and Female Entrepreneurs.",
    //     },
    //     {
    //       heading: "VISION",
    //       paragraph:
    //         "Our motto is to generate business opportunity to people who can be self employed & can create platform of job opportunities to others. PizzaToday India™ recipes are unique and blended well as per the Indian taste buds so from kids to elders our rates are pocket friendly.",
    //     },
    //   ],
    // });

    const aboutUsList: any = await prisma.about_us.findMany({
      select: {
        id: true,
        heading: true,
        paragraph: true,
      },
    });

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.bussinessInfo.getAboutUsList,
      data: aboutUsList,
      status: Status.SUCCESS,
    });
  }
);
const getPrivacyPolicyList = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // const createPrivacyPolicyList: any = await prisma.privacy_policy.createMany(
    //   {
    //     data: [
    //       {
    //         heading: "Information Collected",
    //         paragraph:
    //           "In general, you can visit this website without telling us who you are or revealing any information about yourself. Our web servers collect the domain names, not the e-mail addresses, of visitors. Pizzatoday may collect personal information from you including your first and last name, address, telephone and mobile number(s), email address, credit card details, and any other information, when you knowingly provide us with this information. This will generally occur when you either:",
    //       },
    //       {
    //         heading: "Use and Disclosure",
    //         paragraph:
    //           "When using the Pizzatoday.in internet ordering system, additional information is collected when you order a pizza online. This information assists in the delivery to your door and to verify your credit card payment. The internet order system also stores information about your order to help you remember and re-order the same menu in the future. When concluding your order via the Pizzatoday internet ordering system, you will be asked if you would like to become a WOW Club member. To not become a member, untick the box.",
    //       },
    //       {
    //         heading: "RETURN & REFUND POLICY",
    //         paragraph:
    //           "Pizzatoday DON'T HAVE ANY TYPE OF RETUNS AND REFUND POLICY.",
    //       },
    //     ],
    //   }
    // );

    const privacyPolicyList: any = await prisma.privacy_policy.findMany({
      select: {
        id: true,
        heading: true,
        paragraph: true,
      },
    });

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.bussinessInfo.getPrivacyPolicyList,
      data: privacyPolicyList,
      status: Status.SUCCESS,
    });
  }
);

const getTermsAndConditionsList = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // const createTermsAndConditionsList: any =
    //   await prisma.terms_and_conditions.createMany({
    //     data: [
    //       {
    //         heading: "Sensitive Information",
    //         paragraph:
    //           "Each time you visit the PizzaToday India site our server collects some anonymous information, known as click-stream data, including the type of browser and system you are using; the address of the site you have come from and move to after your visit; the date and time of your visit; and your server's IP address. PizzaToday India may collect this information for statistical purposes to find out how the websites is used and navigated, including the number of hits, the frequency and duration of visits, most popular session times. PizzaToday India may use this information to evaluate and improve the PizzaToday India websites.",
    //       },
    //       {
    //         heading: "Cookies",
    //         paragraph:
    //           "A Cookie is a piece of information that our web server may send to your machine when you visit a PizzaToday India site. A Cookie helps us to recognize you when you re-visit our sites and to co-ordinate your access to different pages on the sites.",
    //       },
    //       {
    //         heading: "Changes",
    //         paragraph:
    //           "If this Privacy Policy is changed, the revised policy will be posted on this site. Please check back periodically, and especially before you provide any personally identifiable information. This Privacy Policy was last updated on Aprl 01 2018.",
    //       },
    //     ],
    //   });

    const termsAndConditionsList: any =
      await prisma.terms_and_conditions.findMany({
        select: {
          id: true,
          heading: true,
          paragraph: true,
        },
      });

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.bussinessInfo.getTermsAndConditionsList,
      data: termsAndConditionsList,
      status: Status.SUCCESS,
    });
  }
);

const createContactUsForm = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, mobile, subject, message, user_id }: ContactUsForm =
      req.body;

    const { error }: any = contactUsFormSchema.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      const data = await prisma.contactus.create({
        data: {
          name,
          email,
          mobile,
          subject,
          message,
          user_id,
          updated_at: new Date().toISOString(),
        },
      });

      return res.status(STATUS_CODES.OK_WITH_CREATION).send({
        message: MESSAGES.bussinessInfo.createContactUsForm,
        data: data,
        status: Status.SUCCESS,
      });
    }
  }
);

export {
  getAboutUsList,
  getPrivacyPolicyList,
  getTermsAndConditionsList,
  createContactUsForm,
};
