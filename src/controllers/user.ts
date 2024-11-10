import prisma from "../connector/connector";
import { STATUS_CODES } from "../constants";
import { MESSAGES, Status } from "../constants/string";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import {
  createUserAddressSchema,
  resendOtpByEmailSchema,
  resendOtpByMobileSchema,
  updateUserAddressSchema,
  updateUserProfileSchema,
  userEmailOtpSchema,
  verifyUserEmailOtpSchema,
} from "../schemas/schema";
import {
  CreateUserAddress,
  ResendOtp,
  UpdateUserProfile,
  userEmailVerificationOtp,
  verifyUserEmailOtp,
} from "../models/auth.model";
import { unserialize, serialize } from "php-serialize";
import Razorpay from "razorpay";
import {
  generateCustId,
  generateEmailForOrderConfirmation,
  generateEmailForOtpVerification,
  generateEmailForResetPasswordOtp,
  generateLoginOTPMessage,
  generateOrderMessage,
  todayDate,
  todayDateTime,
} from "../utils/helper";
import * as crypto from "crypto";
import sendEmail from "../utils/sendEmail";
import Pusher from "pusher";
import sendSMS from "../utils/sendSMS";

const createUserAddress = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, address, locality, type }: CreateUserAddress = req.body;

    const user: any = await prisma.users.findFirst({
      where: {
        id: user_id,
      },
      select: {
        email: true,
        mobile: true,
        name: true,
      },
    });

    if (!user) {
      return next(new ErrorHandler(`User not found`, 404));
    }

    const { error }: any = createUserAddressSchema.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      const user_address = await prisma.user_addresses.create({
        data: {
          user_id: user_id,
          address: address,
          locality: locality,
          email_id: user.email != null ? user.email : "",
          full_name: user.name,
          mobile: user.mobile,
          type: type,
        },
      });
      return res.status(STATUS_CODES.OK_WITH_CREATION).send({
        message: MESSAGES.user.createUserAddress,
        data: user_address,
        status: Status.SUCCESS,
      });
    }
  }
);

const getUserAddressByUserId = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_addresses: any = await prisma.user_addresses.findMany({
      where: {
        user_id: +req.params.id,
      },
    });

    if (user_addresses.length == 0) {
      return next(new ErrorHandler(`User address not found`, 404));
    }

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.getUserAddressByUserId,
      data: user_addresses,
      status: Status.SUCCESS,
    });
  }
);

const getUserAddressById = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_address: any = await prisma.user_addresses.findFirst({
      where: {
        id: +req.params.id,
      },
    });

    if (!user_address) {
      return next(new ErrorHandler(`User not found`, 404));
    }

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.getUserAddressById,
      data: user_address,
      status: Status.SUCCESS,
    });
  }
);

const deleteUserAddressByUserId = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_address: any = await prisma.user_addresses.deleteMany({
      where: {
        user_id: +req.params.id,
      },
    });

    if (user_address.count == 0) {
      return next(new ErrorHandler("user not exists with this user id", 404));
    }

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.deleteUserAddressByUserId,
      data: user_address,
      status: Status.SUCCESS,
    });
  }
);

const deleteUserAddressById = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_address: any = await prisma.user_addresses.findFirst({
      where: {
        id: +req.params.id,
      },
    });

    if (!user_address) {
      return next(new ErrorHandler(`User not found`, 404));
    }

    const delete_address: any = await prisma.user_addresses.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.deleteUserAddressById,
      data: delete_address,
      status: Status.SUCCESS,
    });
  }
);

const updateUserAddressById = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { address, locality, type }: CreateUserAddress = req.body;

    const { error }: any = updateUserAddressSchema.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      const user_address: any = await prisma.user_addresses.findFirst({
        where: {
          id: +req.params.id,
        },
      });

      if (!user_address) {
        return next(new ErrorHandler(`User not found`, 404));
      }

      const update_address: any = await prisma.user_addresses.update({
        data: {
          address,
          locality,
          type,
        },
        where: { id: +req.params.id },
      });

      return res.status(STATUS_CODES.OK).send({
        message: MESSAGES.user.updateUserAddressById,
        data: update_address,
        status: Status.SUCCESS,
      });
    }
  }
);

const applyCoupon = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { coupon_code, area_id, cart, user_id } = req.body;
    let discount = 0;
    let discount_amount = 0;

    const coupon: any = await prisma.coupons.findFirst({
      where: {
        coupon_code,
        status: 0,
        area_id,
      },
    });

    if (!coupon) {
      return next(new ErrorHandler(`Not a valid Coupon Code.`, 404));
    }

    // check coupon validity
    if (
      !(
        new Date() >= new Date(coupon.valid_from) &&
        new Date() <= new Date(coupon.valid_to)
      )
    ) {
      return next(new ErrorHandler(`Your coupon code expire.`, 404));
    }
    // new individual all
    if (coupon.coupon_for == "new" || coupon.coupon_for == "new_user") {
      const new_user: any = await prisma.$queryRaw`
        SELECT id FROM users WHERE id NOT IN (SELECT distinct users.id FROM orders JOIN users on orders.user_id = users.id )`;

      const applicable_user: boolean = new_user.some(
        (user: any) => user.id == user_id
      );

      if (!applicable_user) {
        return next(new ErrorHandler(`This coupon for new users.`, 200));
      }
    } else if (coupon.coupon_for == "individual") {
      const individual_users: any = unserialize(coupon.users);
      const applicable_user: boolean = individual_users.some(
        (id: any) => id == user_id
      );
      if (!applicable_user) {
        return next(new ErrorHandler(`This offer not belongs to you`, 200));
      }
    }

    const cart_total_amount = cart.reduce(
      (total: any, product: any) => total + product.amount,
      0
    );
    const exclude_product_ids: any = unserialize(coupon.product_ids).map(
      Number
    );

    const offer_applicable_amount: any = cart.reduce(
      (amount: any, product: any) => {
        if (!exclude_product_ids.includes(product.product_id)) {
          amount += product.amount;
        }
        return amount;
      },
      0
    );

    if (offer_applicable_amount < coupon.condition) {
      return next(
        new ErrorHandler(
          `Please read term and condition for exclude items. Minimum order amount is ${coupon.condition}. total amount of all cart product exclude items is ${offer_applicable_amount}`,
          200
        )
      );
    }
    let final_total_amount = cart_total_amount;
    let coupon_product: any = {};
    if (coupon.coupon_type == 0) {
      // flat discount
      final_total_amount = cart_total_amount - coupon.discount;
      discount_amount = coupon.discount;
      discount = (coupon.discount * 100) / cart_total_amount;
    } else if (coupon.coupon_type == 1) {
      // discount percetage
      let coupon_discount_amount =
        (offer_applicable_amount * coupon.discount) / 100;
      if (coupon_discount_amount > coupon.max_discount) {
        coupon_discount_amount = coupon.max_discount;
      }

      final_total_amount = cart_total_amount - coupon_discount_amount;
      discount_amount = coupon_discount_amount;
      discount = (coupon_discount_amount * 100) / cart_total_amount;
    } else if (coupon.coupon_type == 2) {
      // coupon provide a product like buy one get one free
      coupon_product = await prisma.products.findFirst({
        where: {
          id: +coupon.menulistOffer,
        },
        select: {
          product_name: true,
          image: true,
          type: true,
          description: true,
          id: true,
          category_id: true,
        },
      });
    }

    const payment_modes: any = unserialize(coupon.payment_modes).map(Number);

    let allow_payment_modes = await prisma.payment_modes.findMany({
      where: {
        id: {
          in: payment_modes,
        },
      },
      select: {
        id: true,
        name: true,
        icon: true,
      },
    });

    const data = {
      coupon_code: coupon.coupon_code,
      coupon_type: coupon.coupon_type,
      term: coupon.term,
      valid_to: coupon.valid_to,
      final_total_amount: final_total_amount,
      cart_total_amount: cart_total_amount,
      coupon_product: coupon_product,
      allow_payment_modes: allow_payment_modes,
      discount_amount,
      discount,
    };

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.applyCoupon,
      data: data,
      status: Status.SUCCESS,
    });
  }
);

const userCouponsListByAreaId = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { area_id, user_id } = req.body;

    const coupons: any = await prisma.coupons.findMany({
      where: {
        status: 0,
        area_id,
      },
    });

    const new_user: any = await prisma.$queryRaw`
        SELECT id FROM users WHERE id NOT IN (SELECT distinct users.id FROM orders JOIN users on orders.user_id = users.id )`;

    const userCoupons = coupons.filter((c: any) => {
      if (
        new Date() >= new Date(c.valid_from) &&
        new Date() <= new Date(c.valid_to)
      ) {
        if (c.coupon_for == "new" || c.coupon_for == "new_user") {
          const applicable_user: boolean = new_user.some(
            (user: any) => user.id == user_id
          );
          return applicable_user;
        } else if (c.coupon_for == "individual") {
          const individual_users: any = unserialize(c.users);
          const applicable_user: boolean = individual_users.some(
            (id: any) => id == user_id
          );
          return applicable_user;
        } else {
          return true;
        }
      } else {
        return false;
      }
    });

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.userCouponsListByAreaId,
      data: userCoupons,
      status: Status.SUCCESS,
    });
  }
);

const checkSingleCategoryDC = (category_id: any, products: any) => {
  let singleCateAmount = 0;

  products.forEach((p: any) => {
    if (p.categoryId === category_id) {
      singleCateAmount += p.amount;
    }
  });

  return singleCateAmount;
};

const checkMultipleCategoryDC = (serializeCategories: any, products: any) => {
  const categories = unserialize(serializeCategories); // Assuming serializeCategories is a JSON string
  let totalCategoryPurchase = 0;

  products.forEach((p: any) => {
    if (categories.includes(p.categoryId)) {
      totalCategoryPurchase += p.amount;
    }
  });

  return totalCategoryPurchase;
};

const getDeliveryCharge = async (
  cart_value: any,
  products: any,
  area_id: any
) => {
  const delivery_charges_list: any = await prisma.delivery_charges.findFirst({
    where: {
      area_id: area_id,
    },
    select: {
      single_category_id: true,
      multiple_categories_id: true,
      multiple_categories_min_amount: true,
      single_category_min_amount: true,
    },
  });

  // Check single category cost
  const singleCategoryCost = checkSingleCategoryDC(
    delivery_charges_list?.single_category_id,
    products
  );
  if (singleCategoryCost >= delivery_charges_list?.single_category_min_amount) {
    return 0;
  } else {
    // Check multiple category cost
    const multipleCategoryCost = checkMultipleCategoryDC(
      delivery_charges_list?.multiple_categories_id,
      products
    );
    if (
      multipleCategoryCost >=
      delivery_charges_list?.multiple_categories_min_amount
    ) {
      return 0;
    }
  }

  const deliveryChargeRangesList: any =
    await prisma.$queryRaw`SELECT dc.single_category_id, dc.single_category_min_amount,dc.multiple_categories_id  ,dcr.min, dcr.max, dcr.amount, dc.area_id FROM delivery_charges_ranges as dcr join delivery_charges as dc on dcr.delivery_charges_id = dc.id where dc.area_id = ${area_id} and dcr.status =0;`;

  // console.log("deliveryChargeRangesList", deliveryChargeRangesList);

  const deliveryChargeRange = deliveryChargeRangesList.find(
    (range: any) => cart_value >= range.min && cart_value <= range.max
  );

  if (deliveryChargeRange) {
    return deliveryChargeRange.amount;
  } else {
    return 0;
  }
};

const userOrderPriceCalculation = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      area_id,
      cart_value,
      products,
      offers,
      discount,
      redeemedPoints,
      redeemPointsValue,
    } = req.body;

    if (cart_value < 99) {
      return next(
        new ErrorHandler("Sorry! we are not accepting order below Rs 99", 200)
      );
    }

    const deliveryChargeAmount = await getDeliveryCharge(
      cart_value,
      products,
      area_id
    );

    let taxes: any = await prisma.taxes.findFirst({
      where: {
        area_id: area_id,
        OR: [{ type: "Online" }, { type: "online" }, { type: "both" }],
      },
      select: {
        tax: true,
        exclud_items: true,
      },
    });

    if (!taxes) {
      taxes = {
        exclud_items: "",
        tax: 0,
      };
    }

    let applicable_tax_product_amount: number = cart_value;
    let applicable_tax_product: any = [];
    if (taxes.exclud_items != "" && taxes.exclud_items != null) {
      const exclude_items: any = unserialize(taxes.exclud_items);

      applicable_tax_product_amount = products.reduce(
        (sum: number, product: any) => {
          if (!exclude_items.includes(product.id + "")) {
            sum = sum + product.amount;
            applicable_tax_product.push(product);
          }
          return sum;
        },
        0
      );
    } else {
      applicable_tax_product = products;
    }

    applicable_tax_product = [...applicable_tax_product, ...offers];

    offers.forEach((offer: any) => {
      applicable_tax_product_amount += offer.amount;
    });

    const totalDiscount =
      Math.round(discount) + Math.round(redeemedPoints * redeemPointsValue);
    const tax_amount = Math.round(
      (applicable_tax_product_amount - totalDiscount) * (taxes.tax / 100)
    );

    const orderPrice = {
      delivery_charge: 0,
      cart_value: cart_value,
      applicable_tax_product,
      applicable_tax_product_amount,
      grandTotal:
        cart_value -
        totalDiscount +
        Math.round(
          (applicable_tax_product_amount - totalDiscount) * (taxes.tax / 100)
        ),
      total_tax_percentage: taxes.tax,
      tax_amount: tax_amount,
      subTotal: cart_value,
      total: cart_value - totalDiscount,
      totalDiscount: totalDiscount,
      coupon_discount: Math.round(discount),
      loyaltyPointAmount: Math.round(redeemedPoints * redeemPointsValue),
    };

    if (deliveryChargeAmount > 0) {
      orderPrice.delivery_charge = deliveryChargeAmount;
      orderPrice.grandTotal += deliveryChargeAmount;
    }

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.userOrderPriceCalculation,
      data: orderPrice,
      status: Status.SUCCESS,
    });
  }
);

const createCodOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      data,
      area_id,
      city_id,
      user_id,
      coupon_code,
      discount,
      discount_amount,
      discount_type,
      order_type,
      sub_total,
      delivery_fee,
      total,
      grand_total,
      payment_mode,
      user_address_id,
      tax,
      tax_amount,
    } = req.body;

    const latestOrder = await prisma.orders.findFirst({
      where: {
        area_id: area_id,
        date: new Date(),
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const lastOrder = await prisma.orders.findFirst({
      where: { area_id: area_id },
      orderBy: {
        created_at: "desc",
      },
    });

    const kot_no = latestOrder ? latestOrder.kot_no + 1 : 1;
    const order_number = lastOrder ? +lastOrder.order_number + 1 + "" : "1";

    const cust_id: string = generateCustId();

    const order: any = await prisma.orders.create({
      data: {
        area_id,
        city_id,
        user_id,
        cust_id,
        order_number,
        kot_no,
        coupon_code,
        discount,
        discount_amount,
        discount_type,
        tax,
        tax_amount,
        sub_total,
        delivery_fee,
        total,
        grand_total,
        payment_status: 1,
        payment_mode,
        order_accepted: 0,
        order_type,
        pg_status: "1",
        status: 0,
        user_address_id: user_address_id ? user_address_id : 0,
        date: todayDate(new Date()),
        created_at: todayDateTime(new Date()),
        updated_at: todayDateTime(new Date()),
      },
    });

    let emailProductList: any = [];

    let orderDetailData = data.map((orderItem: any) => {
      let size_id = "";
      let size_name = "";
      let crust_id = "0";
      let crust_name = "0";
      let topping_id = "0";
      let topping_name = "";
      let topping_amount = 0;
      if (
        orderItem.category_id == 1 &&
        orderItem.hasOwnProperty("customizations")
      ) {
        size_id = orderItem.customizations.sizes.size_id;
        size_name = orderItem.customizations.sizes.sizes_name;
        crust_id = orderItem.customizations.sizes.crust_id;
        crust_name = orderItem.customizations.sizes.crust_name;
        if (orderItem.customizations.toppings.length > 0) {
          topping_id = "";
          let toppings = orderItem.customizations.toppings;
          toppings.forEach((t: any) => {
            topping_id += t.topping_id + ",";
            topping_name += t.topping_name + ",";
            topping_amount += t.selected_topping_price;
          });
          topping_id = topping_id.slice(0, -1);
          topping_name = topping_name.slice(0, -1);
        }
      }

      let newData = {
        order_id: order.id,
        city_id: city_id,
        area_id: area_id,
        area_product_id: orderItem.area_product_id,
        product_id: orderItem.hasOwnProperty("id")
          ? orderItem.id
          : orderItem.hasOwnProperty("offerId")
          ? +orderItem.offerId
          : 0,
        category_id: orderItem.hasOwnProperty("category_id")
          ? +orderItem.category_id
          : orderItem.hasOwnProperty("offerId")
          ? 10
          : 0,
        price: +orderItem.default_price,
        qty: orderItem.qty,
        total: orderItem.default_price * orderItem.qty,
        size_id,
        size_name,
        crust_id: crust_id + "",
        crust_name,
        topping_id,
        topping_name,
        topping_amount,
        offer_id: orderItem.hasOwnProperty("offerId") ? +orderItem.offerId : 0,
        offer_items: orderItem.hasOwnProperty("offerId")
          ? serialize(orderItem.products)
          : "0",
      };

      if (orderItem.hasOwnProperty("offer_name")) {
        emailProductList.push({
          name: orderItem.offer_name,
          qty: orderItem.qty,
          price: orderItem.default_price,
        });
      }
      if (orderItem.hasOwnProperty("product_name")) {
        emailProductList.push({
          name: orderItem.product_name,
          qty: orderItem.qty,
          price: orderItem.default_price,
        });
      }

      return newData;
    });

    const orderDetails = await prisma.order_details.createMany({
      data: orderDetailData,
    });

    const userAddress: any = await prisma.user_addresses.findFirst({
      where: {
        id: user_address_id ? user_address_id : 0,
      },
      select: {
        address: true,
      },
    });

    const area: any = await prisma.areas.findFirst({
      where: {
        id: area_id,
      },
      select: {
        name: true,
        address: true,
        contact_no: true,
        email: true,
      },
    });
    const area_tax: any = await prisma.taxes.findFirst({
      where: {
        area_id: area_id,
      },
      select: {
        gst_no: true,
      },
    });

    const user: any = await prisma.users.findFirst({
      where: {
        id: user_id,
      },
      select: {
        email: true,
        mobile: true,
        name: true,
      },
    });

    try {
      if (user.email != "" && user.email != null) {
        await sendEmail({
          email: user.email,
          subject: "Order Confirmation - Pizza Today",
          message: generateEmailForOrderConfirmation(
            emailProductList,
            order,
            user,
            area,
            area_tax,
            userAddress ? userAddress?.address : "",
            "COD"
          ),
        });
      }

      let smsMessage: string = generateOrderMessage(
        order.order_number,
        grand_total
      );

      const response: any = await sendSMS({
        template_name: "ORDER",
        message: smsMessage,
        mobile_no: user.mobile,
      });

      if (response.data && response.data.Status != "Success") {
        return next(new ErrorHandler(response.data.Description, 500));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }

    initiatePusherForNotification(order);

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.createOrder,
      data: order,
      status: Status.SUCCESS,
    });
  }
);

const createRazorPayOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      data,
      area_id,
      city_id,
      user_id,
      payment_mode,
      coupon_code,
      discount,
      discount_amount,
      discount_type,
      order_type,
      sub_total,
      delivery_fee,
      total,
      grand_total,
      user_address_id,
      tax,
      tax_amount,
    } = req.body;

    const latestOrder = await prisma.orders.findFirst({
      where: {
        area_id: area_id,
        date: new Date(),
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const lastOrder = await prisma.orders.findFirst({
      where: { area_id: area_id },
      orderBy: {
        created_at: "desc",
      },
    });

    const kot_no = latestOrder ? latestOrder.kot_no + 1 : 1;
    const order_number = lastOrder ? +lastOrder.order_number + 1 + "" : "1";

    const cust_id: string = generateCustId();

    const order: any = await prisma.orders.create({
      data: {
        area_id,
        city_id,
        user_id,
        cust_id,
        order_number,
        kot_no,
        coupon_code,
        discount,
        discount_amount,
        discount_type,
        tax,
        tax_amount,
        sub_total,
        delivery_fee,
        total,
        grand_total,
        payment_status: 0,
        payment_mode,
        order_accepted: 0,
        order_type,
        pg_status: "",
        status: 0,
        user_address_id: user_address_id ? user_address_id : 0,
        date: todayDate(new Date()),
        created_at: todayDateTime(new Date()),
        updated_at: todayDateTime(new Date()),
      },
    });

    let emailProductList: any = [];

    let orderDetailData = data.map((orderItem: any) => {
      let size_id = "";
      let size_name = "";
      let crust_id = "0";
      let crust_name = "0";
      let topping_id = "0";
      let topping_name = "";
      let topping_amount = 0;
      if (
        orderItem.category_id == 1 &&
        orderItem.hasOwnProperty("customizations")
      ) {
        size_id = orderItem.customizations.sizes.size_id;
        size_name = orderItem.customizations.sizes.sizes_name;
        crust_id = orderItem.customizations.sizes.crust_id;
        crust_name = orderItem.customizations.sizes.crust_name;
        if (orderItem.customizations.toppings.length > 0) {
          topping_id = "";
          let toppings = orderItem.customizations.toppings;
          toppings.forEach((t: any) => {
            topping_id += t.topping_id + ",";
            topping_name += t.topping_name + ",";
            topping_amount += t.selected_topping_price;
          });
          topping_id = topping_id.slice(0, -1);
          topping_name = topping_name.slice(0, -1);
        }
      }

      let newData = {
        order_id: order.id,
        city_id: city_id,
        area_id: area_id,
        area_product_id: orderItem.area_product_id,
        product_id: orderItem.hasOwnProperty("id")
          ? orderItem.id
          : orderItem.hasOwnProperty("offerId")
          ? +orderItem.offerId
          : 0,
        category_id: orderItem.hasOwnProperty("category_id")
          ? +orderItem.category_id
          : orderItem.hasOwnProperty("offerId")
          ? 10
          : 0,
        price: +orderItem.default_price,
        qty: orderItem.qty,
        total: orderItem.default_price * orderItem.qty,
        size_id,
        size_name,
        crust_id: crust_id + "",
        crust_name,
        topping_id,
        topping_name,
        topping_amount,
        offer_id: orderItem.hasOwnProperty("offerId") ? +orderItem.offerId : 0,
        offer_items: orderItem.hasOwnProperty("offerId")
          ? serialize(orderItem.products)
          : "0",
      };

      if (orderItem.hasOwnProperty("offer_name")) {
        emailProductList.push({
          name: orderItem.offer_name,
          qty: orderItem.qty,
        });
      }
      if (orderItem.hasOwnProperty("product_name")) {
        emailProductList.push({
          name: orderItem.product_name,
          qty: orderItem.qty,
        });
      }

      return newData;
    });

    const orderDetails = await prisma.order_details.createMany({
      data: orderDetailData,
    });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_LIVE_KEY_ID as string,
      key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET as string,
    });

    const options = {
      amount: grand_total * 100,
      currency: "INR",
      receipt: cust_id,
      payment_capture: 1,
      // partial_payment: false,
    };

    const razorPayResponse = await razorpay.orders.create(options);

    const update_order: any = await prisma.orders.update({
      data: {
        razorpay_order_id: razorPayResponse.id,
      },
      where: { id: order.id },
    });

    const responseData = {
      order_data: update_order,
      razorpay_order_id: razorPayResponse.id,
      currency: razorPayResponse.currency,
      amount: razorPayResponse.amount,
      receipt: razorPayResponse.receipt,
    };

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.createOrder,
      data: responseData,
      status: Status.SUCCESS,
    });
  }
);

const initiateRazorpayOrderPayment = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      data,
      order_id,
      PG_partner,
      transaction_id,
      merchant_txn_id,
      razorpay_signature,
      razorpay_order_id,
      loyalty_point,
      user_id,
      user_address_id,
      transaction_message,
    } = req.body;

    const key_secret = process.env.RAZORPAY_LIVE_KEY_SECRET as string;

    // Function to verify the Razorpay payment signature
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(razorpay_order_id + "|" + merchant_txn_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Signatures match, payment is verified
      deductUserLoyaltyPoint(user_id, loyalty_point, next);

      const loyalty_point_data = await prisma.loyalty_point.findFirst({
        where: {
          id: 1,
        },
        select: {
          one_point_in_rupees: true,
        },
      });
      const loyalty_point_rupees = loyalty_point_data
        ? loyalty_point_data.one_point_in_rupees
        : 0;

      const payments: any = await prisma.payments.create({
        data: {
          PG_partner,
          transaction_id,
          merchant_txn_id,
          bank_txn_id: merchant_txn_id,
          order_id,
          status: "success",
          status_code: 1,
          message: "transaction done",
          created_at: todayDateTime(new Date()),
          updated_at: todayDateTime(new Date()),
        },
      });

      const updateOrder: any = await prisma.orders.update({
        where: {
          id: order_id,
        },
        data: {
          loyalty_point_rupees: loyalty_point_rupees,
          loyalty_point: loyalty_point,
          payment_status: 1,
          pg_status: "success",
          updated_at: todayDateTime(new Date()),
        },
        select: {
          cust_id: true,
          grand_total: true,
          area_id: true,
          id: true,
          kot_no: true,
          created_at: true,
          order_number: true,
          sub_total: true,
          discount_amount: true,
          tax_amount: true,
          delivery_fee: true,
          order_type: true,
        },
      });

      let emailProductList: any = [];
      data.forEach((item: any) => {
        if (item.hasOwnProperty("offer_name")) {
          emailProductList.push({
            name: item.offer_name,
            qty: item.qty,
            price: item.default_price,
          });
        }
        if (item.hasOwnProperty("product_name")) {
          emailProductList.push({
            name: item.product_name,
            qty: item.qty,
            price: item.default_price,
          });
        }
      });

      const userAddress: any = await prisma.user_addresses.findFirst({
        where: {
          id: user_address_id ? user_address_id : 0,
        },
        select: {
          address: true,
        },
      });

      const area: any = await prisma.areas.findFirst({
        where: {
          id: updateOrder.area_id,
        },
        select: {
          name: true,
          address: true,
          contact_no: true,
          email: true,
        },
      });
      const area_tax: any = await prisma.taxes.findFirst({
        where: {
          area_id: updateOrder.area_id,
        },
        select: {
          gst_no: true,
        },
      });

      const user: any = await prisma.users.findFirst({
        where: {
          id: user_id,
        },
        select: {
          email: true,
          mobile: true,
          name: true,
        },
      });
      try {
        if (user.email != "" && user.email != null) {
          await sendEmail({
            email: user.email,
            subject: "Order Confirmation - Pizza Today",
            message: generateEmailForOrderConfirmation(
              emailProductList,
              updateOrder,
              user,
              area,
              area_tax,
              userAddress ? userAddress?.address : "",
              "Razorpay"
            ),
          });
        }

        let smsMessage: string = generateOrderMessage(
          updateOrder.order_number,
          updateOrder.grand_total
        );

        const response: any = await sendSMS({
          template_name: "ORDER",
          message: smsMessage,
          mobile_no: user.mobile,
        });

        if (response.data && response.data.Status != "Success") {
          return next(new ErrorHandler(response.data.Description, 500));
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      initiatePusherForNotification(updateOrder);

      return res.status(STATUS_CODES.OK).send({
        message: "Payment verified successfully!",
        data: payments,
        status: Status.SUCCESS,
      });
    } else {
      // Signatures do not match, payment verification failed
      const payments: any = await prisma.payments.create({
        data: {
          PG_partner,
          transaction_id,
          merchant_txn_id,
          bank_txn_id: merchant_txn_id,
          order_id,
          status: "failure",
          status_code: 0,
          message:
            transaction_message != "undefined" && !transaction_message
              ? transaction_message
              : "transaction failed",
          created_at: todayDateTime(new Date()),
          updated_at: todayDateTime(new Date()),
        },
      });

      const updateOrder: any = await prisma.orders.update({
        where: {
          id: order_id,
        },
        data: {
          payment_status: 2,
          pg_status: "failure",
          updated_at: todayDateTime(new Date()),
        },
      });

      return res.status(STATUS_CODES.OK).send({
        message: "Payment verification failed.",
        data: payments,
        status: Status.ERROR,
      });
    }
  }
);

const userResendOtp = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email_mobile, is_email_login }: ResendOtp = req.body;
    let condition: any = {};
    var error: any;

    if (is_email_login) {
      condition = { email: email_mobile };
      error = resendOtpByEmailSchema.validate({
        email_mobile,
      }).error;
    } else {
      condition = { mobile: email_mobile + "" };
      error = resendOtpByMobileSchema.validate({
        email_mobile,
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
        },
      });

      if (!user) {
        return next(
          new ErrorHandler("user not exists with this email or mobile", 400)
        );
      }

      const mobile_otp = +(1000 + Math.random() * 9999 + "").substring(0, 4);
      const email_otp = +(1000 + Math.random() * 9999 + "").substring(0, 4);

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

      const update_user: any = await prisma.users.update({
        data: {
          mobile_otp,
          email_otp,
        },
        where: { id: +user.id },
      });

      return res.status(STATUS_CODES.OK).send({
        message: MESSAGES.user.userResendOtp,
        data: {},
        status: Status.SUCCESS,
      });
    }
  }
);

//update User profile
const updateUserProfile = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, dob, user_id }: UpdateUserProfile = req.body;
    const { error }: any = updateUserProfileSchema.validate(req.body);
    console.log("inside node js route");

    // if (error) {
    //   return next(new ErrorHandler(error.details[0].message, 400));
    // } else {
    //   let data: any = {
    //     name,
    //     dob,
    //   };
    //   if (req.file) {
    //     data.image = req.file.filename;
    //   }

    //   const userUpdate = await prisma.users.update({
    //     data: {
    //       ...data,
    //     },
    //     where: { id: +user_id },
    //     select: {
    //       id: true,
    //       name: true,
    //       dob: true,
    //       image: true,
    //     },
    //   });

    //   return res.status(STATUS_CODES.OK).send({
    //     message: MESSAGES.user.userUpdate,
    //     data: userUpdate,
    //     status: Status.SUCCESS,
    //   });
    // }
  }
);

const userMyOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // order status 0 and payment status 1 -> Order completed
    // order status 0 and payment status 2 -> Failed payment
    // order status 0 and payment status 0 -> Payment pending
    // order status 2 -> Cancel order

    const orderList: any = await prisma.$queryRaw`
      SELECT 
      od.id as order_details_id, 
      o.id as order_id, 
      o.delivery_fee , 
      o.total as order_total, 
      o.grand_total , 
      o.order_type, 
      o.tax, 
      o.tax_amount, 
      o.loyalty_point, 
      o.loyalty_point_rupees, 
      o.payment_mode , 
      o.payment_status as order_payment_status, 
      o.cust_id , 
      o.user_id , 
      od.size_id,
      od.size_name,
      od.crust_id,
      od.crust_name,
      od.topping_id,
      od.topping_name,
      od.topping_amount,
      od.category_id,
      od.total as order_detail_total, 
      p.type, 
      p.product_name, 
      od.qty,
      od.offer_id, 
      od.offer_items, 
      us.locality, 
      us.address,
      pt.bank_txn_id,
      pt.merchant_txn_id,
      pt.status as payment_status,
      pt.status_code as payment_status_code,
      pt.message as payment_message,
      a.name as area_name,
      c.name as city_name,
      o.order_accepted,
      o.created_at,
      o.status as order_status, 
      o.payment_status as order_payment_status,  
      offers.name as offers_name,
      offers.description as offers_description
      FROM 
        order_details AS od
      LEFT JOIN 
        products AS p ON od.product_id = p.id
      INNER JOIN 
        orders AS o ON od.order_id = o.id
      INNER JOIN 
        cities AS c ON c.id = o.city_id
      INNER JOIN 
        areas AS a ON a.id = o.area_id
      LEFT JOIN 
       offers  ON offers.id = od.offer_id
      left JOIN 
        user_addresses AS us ON us.id = o.user_address_id
      left JOIN 
        payments AS pt ON pt.order_id = o.id
      WHERE 
        o.user_id = ${req.params.id}
      order by od.id desc`;

    const orders = orderList.map((o: any) => {
      if (o.offer_id != 0 && o.offer_items != 0) {
        // o.offer_items = unserialize(o.offer_items);
        try {
          // Unserialize the PHP serialized string
          o.offer_items = unserialize(o.offer_items, {
            objectCallback: (name: any) => {
              if (name === "stdClass") {
                return {}; // Replace stdClass with a plain JS object
              }
              return null; // For other classes, return null
            },
          });
        } catch (error) {
          console.error("Error during unserialization:", error);
        }
      }
      return o;
    });
    const formattedOrders = formattedOrderList(orders);

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.userMyOrders,
      data: formattedOrders,
      status: Status.SUCCESS,
    });
  }
);
const getUserRefferalCodeAndLoyaltypoint = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await prisma.users.findFirst({
      where: {
        id: +req.params.id,
      },
      select: {
        referral_code: true,
        loyalty_point: true,
      },
    });
    const loyalty_point = await prisma.loyalty_point.findFirst({
      where: {
        id: 1,
      },
      select: {
        one_point_in_rupees: true,
        minimum_redeem_point: true,
      },
    });
    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.getUserRefferalCodeAndLoyaltypoint,
      data: { ...data, ...loyalty_point },
      status: Status.SUCCESS,
    });
  }
);

const validateReferralCodeForSharing = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const loyalty_point = await prisma.loyalty_point.findFirst({
      where: {
        id: 1,
      },
    });

    let resData: any = {
      activeLoyaltyPointService: loyalty_point?.service_active,
      minimum_redeem_point: loyalty_point?.minimum_redeem_point,
    };

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.getUserRefferalCodeAndLoyaltypoint,
      data: resData,
      status: Status.SUCCESS,
    });
  }
);
const checkLoyaltyPointService = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const loyalty_point = await prisma.loyalty_point.findFirst({
      where: {
        id: +1,
      },
      select: {
        service_active: true,
      },
    });

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.getUserRefferalCodeAndLoyaltypoint,
      data: { service_active: Boolean(loyalty_point?.service_active) },
      status: Status.SUCCESS,
    });
  }
);

const formattedOrderList = (data: any) => {
  const result: any = [];

  data.forEach((item: any) => {
    // Find if order already exists in result
    let existingOrder = result.find(
      (order: any) => order.order_id === item.order_id
    );

    if (!existingOrder) {
      // If order doesn't exist, create a new order object
      existingOrder = {
        order_id: item.order_id,
        delivery_fee: item.delivery_fee,
        order_total: item.order_total,
        grand_total: item.grand_total,
        order_type: item.order_type,
        payment_mode: item.payment_mode,
        order_payment_status: item.order_payment_status,
        cust_id: item.cust_id,
        user_id: item.user_id,
        order_details: [],
        locality: item.locality,
        address: item.address,
        bank_txn_id: item.bank_txn_id,
        merchant_txn_id: item.merchant_txn_id,
        payment_status: item.payment_status,
        payment_status_code: item.payment_status_code,
        payment_message: item.payment_message,
        city_name: item.city_name,
        area_name: item.area_name,
        order_accepted: item.order_accepted,
        created_at: item.created_at,
        tax: item.tax,
        tax_amount: item.tax_amount,
        loyalty_point: item.loyalty_point,
        loyalty_point_rupees: item.loyalty_point_rupees,
        display_order_status: display_order_status(
          item.order_status,
          item.order_payment_status
        ),
      };

      // Push the new order to the result array
      result.push(existingOrder);
    }

    let customization = null;
    if (item.category_id == 1) {
      customization = {
        size_id: item.size_id,
        size_name: item.size_name,
        crust_id: item.crust_id,
        crust_name: item.crust_name,
        topping_id: item.topping_id,
        topping_name: item.topping_name,
        topping_amount: item.topping_amount,
      };
    }

    // Add the current order detail to the existing order
    existingOrder.order_details.push({
      order_details_id: item.order_details_id,
      price: item.price,
      type: item.type,
      product_name: item.product_name,
      qty: item.qty,
      offer_id: item.offer_id,
      offer_items: item.offer_items,
      offers_name: item.offers_name,
      offers_description: item.offers_description,
      customization: customization,
    });
  });

  return result;
};

const display_order_status = (order_status: any, order_payment_status: any) => {
  if (order_status == 0 && order_payment_status == 1) {
    return "Completed";
  } else if (order_status == 0 && order_payment_status == 2) {
    return "Payment Failed";
  } else if (order_status == 0 && order_payment_status == 0) {
    return "Payment pending";
  } else if (order_status == 2) {
    return "Cancelled";
  } else {
    return "";
  }
};

const deductUserLoyaltyPoint = async (
  user_id: any,
  loyalty_point: any,
  next: NextFunction
) => {
  if (loyalty_point != 0) {
    const user = await prisma.users.findFirst({
      where: {
        id: user_id,
      },
      select: {
        loyalty_point: true,
      },
    });

    if (user) {
      if (user.loyalty_point && user.loyalty_point < loyalty_point) {
        return next(new ErrorHandler("Insufficient loyalty point", 400));
      }

      await prisma.users.update({
        where: {
          id: user_id,
        },
        data: {
          loyalty_point: user.loyalty_point
            ? user.loyalty_point - loyalty_point
            : user.loyalty_point,
        },
      });
    } else {
      return next(new ErrorHandler("User not found", 400));
    }
  }
};

const initiatePusherForNotification = (order: any) => {
  // Initialize Pusher
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.PUSHER_APP_KEY as string,
    secret: process.env.PUSHER_APP_SECRET as string,
    cluster: process.env.PUSHER_APP_CLUSTER as string,
    useTLS: true,
  });

  // Trigger a notification to the 'notifications' channel
  pusher.trigger(
    `OrderShipped-channel-${order.area_id}`,
    "App\\Events\\OrderShipped",
    {
      message: "New order received",
      area_id: order.area_id,
      id: order.id,
      kot_no: order.kot_no,
      grand_total: order.grand_total,
      created_at: order.created_at,
    }
  );
};

const getUserEmailVerificationOtp = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, user_id }: userEmailVerificationOtp = req.body;

    const error = userEmailOtpSchema.validate({
      user_id,
      email,
    }).error;

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      const uniqueUserEmail: any = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });
      if (uniqueUserEmail) {
        return next(new ErrorHandler("user email should be unique", 400));
      }

      const user: any = await prisma.users.findFirst({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        return next(new ErrorHandler("user not exists", 400));
      }

      const email_otp = +(1000 + Math.random() * 9999 + "").substring(0, 4);

      try {
        await sendEmail({
          email: email,
          subject: "Email Verification OTP - Pizza Today",
          message: generateEmailForOtpVerification(email_otp),
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      const update_user: any = await prisma.users.update({
        data: {
          email_otp,
          email: email,
        },
        where: { id: +user.id },
      });

      return res.status(STATUS_CODES.OK).send({
        message: MESSAGES.user.userEmailVerificationOtp,
        data: {},
        status: Status.SUCCESS,
      });
    }
  }
);

const verifyUserEmailOtp = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email_otp, user_id }: verifyUserEmailOtp = req.body;

    const error = verifyUserEmailOtpSchema.validate({
      user_id,
      email_otp,
    }).error;

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      let user: any = await prisma.users.findFirst({
        where: {
          id: user_id,
        },
        select: {
          email_otp: true,
        },
      });

      if (!user) {
        return next(
          new ErrorHandler("user not exists", STATUS_CODES.UNAUTHORIZED_ACCESS)
        );
      } else if (user.email_otp != email_otp) {
        return next(
          new ErrorHandler(
            "Invalid email otp or user id",
            STATUS_CODES.UNAUTHORIZED_ACCESS
          )
        );
      }

      const updateUser: any = await prisma.users.update({
        data: {
          is_email_verified: true,
        },
        where: { id: user_id },
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          is_email_verified: true,
          is_mobile_verified: true,
          referral_code: true,
        },
      });

      return res.status(STATUS_CODES.OK).send({
        message: MESSAGES.auth.verifyUserOtp,
        data: updateUser,
        status: Status.SUCCESS,
      });
    }
  }
);

export {
  createUserAddress,
  getUserAddressById,
  getUserAddressByUserId,
  deleteUserAddressByUserId,
  deleteUserAddressById,
  updateUserAddressById,
  applyCoupon,
  userCouponsListByAreaId,
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
  getUserEmailVerificationOtp,
  verifyUserEmailOtp,
};
