import prisma from "../connector/connector";
import { STATUS_CODES } from "../constants";
import { MESSAGES, Status } from "../constants/string";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { Request, Response, NextFunction } from "express";
import geolib from "geolib";
import { NearestStoreCategories } from "../models/auth.model";
import ErrorHandler from "../utils/errorHandler";
import { nearestStoreCategoriesSchema } from "../schemas/schema";
import {
  checkTimeBetweenTimeRange,
  getTimeFromDate,
  todayDateTime,
} from "../utils/helper";

//User getNearestStoreCategories
const getNearestStoreCategories = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { latitude, longitude }: NearestStoreCategories = req.body;

    const { error }: any = nearestStoreCategoriesSchema.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    } else {
      const areaData: any = await prisma.areas.findMany({
        select: {
          latitude: true,
          longitude: true,
          id: true,
        },
      });

      const locationData = areaData.map((data: any) => ({
        latitude: data.latitude,
        longitude: data.longitude,
      }));

      const findNearest: any = geolib.findNearest(
        { latitude, longitude },
        locationData
      );

      const getDistance = geolib.getDistance(
        { latitude, longitude },
        findNearest
      );

      if (getDistance > 12999) {
        return next(
          new ErrorHandler("No nearby outlet found in 12km radius", 200)
        );
      }

      const area_id = areaData.find(
        (data: any) =>
          data.latitude.includes(findNearest.latitude) &&
          data.longitude.includes(findNearest.longitude)
      ).id;

      const store: any = await prisma.areas.findFirst({
        where: {
          id: area_id,
          status: 1,
        },
        select: {
          id: true,
          name: true,
          address: true,
          store_open: true,
          store_close: true,
          is_store_open: true,
          city_id: true,
          is_loggedin: true,
        },
      });

      let timeToCheck = getTimeFromDate(todayDateTime(new Date()));
      let startTime = getTimeFromDate(store.store_open);
      let endTime = getTimeFromDate(store.store_close);
      let store_offline = true;
      if (
        store &&
        store.is_store_open == 1 &&
        store.is_loggedin == 1 &&
        checkTimeBetweenTimeRange(timeToCheck, startTime, endTime)
      ) {
        store_offline = false;
      }

      const categoryByArea: any =
        await prisma.$queryRaw`SELECT distinct ap.area_id, c.id, c.name FROM area_products as ap join categories as c on ap.category_id = c.id  where ap.area_id = ${area_id} and c.status= 1 order by c.id`;

      const offersByArea: any = await prisma.offers.findMany({
        where: {
          status: 1,
          area_id: area_id,
        },
        select: {
          id: true,
          image: true,
          status: true,
          description: true,
          amount: true,
          name: true,
          offer_type: true,
          area_id: true,
        },
      });

      return res.status(STATUS_CODES.OK).send({
        message: MESSAGES.store.nearestStoreCategories,
        data: {
          store: { ...store, timeToCheck, startTime, endTime, store_offline },
          categoryByArea,
          getDistance,
          offersByArea,
        },
        status: Status.SUCCESS,
      });
    }
  }
);

const getStoreCategoriesOfferByAreaId = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const area_id = +req.params.id;

    const store: any = await prisma.areas.findFirst({
      where: {
        id: area_id,
        status: 1,
      },
      select: {
        id: true,
        name: true,
        address: true,
        store_open: true,
        store_close: true,
        is_store_open: true,
        is_loggedin: true,
        city_id: true,
      },
    });

    let timeToCheck = getTimeFromDate(todayDateTime(new Date()));
    let startTime = getTimeFromDate(store.store_open);
    let endTime = getTimeFromDate(store.store_close);
    let store_offline = true;
    if (
      store &&
      store.is_store_open == 1 &&
      store.is_loggedin == 1 &&
      checkTimeBetweenTimeRange(timeToCheck, startTime, endTime)
    ) {
      store_offline = false;
    }

    const categoryByArea: any =
      await prisma.$queryRaw`SELECT distinct ap.area_id, c.id, c.name FROM area_products as ap join categories as c on ap.category_id = c.id  where ap.area_id = ${area_id} and c.status= 1 and c.id not in (4,5) order by c.id`;

    const offersByArea: any = await prisma.offers.findMany({
      where: {
        status: 1,
        area_id: area_id,
      },
      select: {
        id: true,
        image: true,
        status: true,
        description: true,
        amount: true,
        name: true,
        offer_type: true,
        area_id: true,
      },
    });

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.store.nearestStoreCategories,
      data: {
        store: { ...store, timeToCheck, startTime, endTime, store_offline },
        categoryByArea,
        offersByArea,
      },
      status: Status.SUCCESS,
    });
  }
);

//User getCityArea
const getCityArea = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const result: any = await prisma.$queryRaw`
		SELECT 
		areas.name as area_name,
        areas.id as area_id,
        cities.id as city_id,
        cities.name as city_name
        
    FROM 
        cities 
    INNER JOIN 
        areas ON areas.city_id = cities.id
  `;

    const outputData: any = {
      city: [],
      area: [],
    };

    const cityMap: any = new Map();

    result.forEach((item: any) => {
      if (!cityMap.has(item.city_id)) {
        cityMap.set(item.city_id, {
          city_id: item.city_id,
          city_name: item.city_name,
        });
        outputData.city.push(cityMap.get(item.city_id));
      }
      outputData.area.push({
        area_name: item.area_name,
        area_id: item.area_id,
        city_id: item.city_id,
      });
    });

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.store.cityArea,
      data: outputData,
      status: Status.SUCCESS,
    });
  }
);

const getMenuListByArea = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const menuList: any = await prisma.$queryRaw`
		 SELECT p.image, ap.default_price, p.product_name, ap.category_id, p.type, p.description,p.id as product_id, ap.id as area_product_id FROM products p
     inner join area_products as ap ON ap.product_id = p.id
     where ap.area_id = ${req.params.id} and ap.sale_on != "offline" and p.category_id NOT IN (4,5) and ap.user_display = 1;
  `;

    const crustList: any = await prisma.crusts.findMany({
      where: {
        status: 1,
      },
    });

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.store.menuListByArea,
      data: { menuList, crustList },
      status: Status.SUCCESS,
    });
  }
);

const getCustomizationByArea = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const crustsData: any = await prisma.$queryRaw`
		Select area_products.id area_product_id, menu_crust_details.id menu_crust_details_id, area_products.product_id, 
      menu_crust_details.size_id, menu_crust_details.price, menu_crust_details.crust_id, crusts.crust_name, crusts.crust_icon,menu_crust_details.area_id,
      sizes.id, sizes.name as sizes_name, sizes.serves,
      CASE
        when menu_crust_details.size_id = area_products.default_size_id and default_crust_id = crust_id then 1
        else 0 
        END as default_size
      FROM menu_crust_details inner join area_products on
      area_products.id = menu_crust_details.area_product_id
      INNER JOIN crusts on crust_id = crusts.id
      INNER JOIN sizes on size_id = sizes.value 
      where crusts.status = 1 and menu_crust_details.area_id = ${req.params.id}
      order by area_products.id `;

    const toppings: any = await prisma.$queryRaw`
		SELECT id as topping_id, topping_name, topping_type,topping_price_regular, topping_price_medium, topping_price_large, topping_price_extra_large, topping_image FROM toppings where area_id = ${req.params.id}`;

    const crusts = crustsData.map((crust: any) => {
      return {
        ...crust,
        area_product_id: Number(crust.area_product_id),
        menu_crust_details_id: Number(crust.menu_crust_details_id),
        product_id: Number(crust.product_id),
        size_id: crust.size_id,
        crust_id: Number(crust.crust_id),
        area_id: Number(crust.area_id),
        id: Number(crust.id),
        default_size: Number(crust.default_size),
      };
    });

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.store.customizationByCategory,
      data: { crusts, toppings },
      status: Status.SUCCESS,
    });
  }
);

const getToppingByOfferItemId = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const toppings: any = await prisma.$queryRaw`
    	SELECT *,
  CASE 
  when (Select distinct offer_id from offer_item_menus where default_size_id = 'R' and  offer_item_id=${req.params.id}) then topping_price_regular 
  when (Select distinct offer_id from offer_item_menus where default_size_id = 'M' and offer_item_id=${req.params.id}) then topping_price_medium 
  when (Select distinct offer_id from offer_item_menus where default_size_id = 'L' and offer_item_id= ${req.params.id}) then topping_price_large 
  when (Select distinct offer_id from offer_item_menus where default_size_id = 'XL'and offer_item_id=${req.params.id}) then topping_price_extra_large 
  else 0
  END AS default_topping_price,
  topping_image,
  "1" as category_id FROM toppings where toppings.area_id = ${req.params.areaId}`;

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.store.toppingByOfferItemId,
      data: toppings,
      status: Status.SUCCESS,
    });
  }
);

const getPaymentModesByArea = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentModes: any =
      await prisma.$queryRaw` SELECT pm.id, pm.name, pm.icon FROM area_payment_modes as apm join payment_modes as pm on apm.payment_mode_id =  pm.id where apm.area_id = ${req.params.id} and apm.status = 0;
    `;

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.getPaymentModesByArea,
      data: paymentModes,
      status: Status.SUCCESS,
    });
  }
);

const getProductListByOfferId = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const offer_id = +req.params.id;
    const productList: any =
      await prisma.$queryRaw`Select om.id as offer_item_menus_id, om.default_size_id, om.default_crust_id, c.crust_name, om.offer_id, om.offer_item_id, om.product_id, p.product_name, p.type, p.image, p.description from offer_item_menus as om join products as p on om.product_id = p.id join crusts as c on c.id = om.default_crust_id  where om.offer_id = ${offer_id} and p.status =  1;`;

    const formattedProductList = Object.values(
      productList.reduce((result: any, currentItem: any) => {
        // Get the value of the key to group by
        const groupKey = currentItem["offer_item_id"];

        // If the group doesn't exist yet, create it
        if (!result[groupKey]) {
          result[groupKey] = [];
        }

        // Add the current item to the group
        result[groupKey].push(currentItem);

        return result;
      }, {})
    );

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.user.getProductListByOfferId,
      data: formattedProductList,
      status: Status.SUCCESS,
    });
  }
);

const getAllSettings = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const settings: any = await prisma.site_settings.findMany({
      select: {
        menu_background_image: true,
        page_background_image: true,
        head_office_address: true,
        corporate_office_address: true,
        facebook: true,
        twitter: true,
        instagram: true,
        map_location: true,
        head_office_no: true,
        corporate_office_no: true,
        brochure_pdf: true,
        terms_conditions: true,
      },
    });

    return res.status(STATUS_CODES.OK).send({
      message: MESSAGES.store.settings,
      data: settings,
      status: Status.SUCCESS,
    });
  }
);

export {
  getNearestStoreCategories,
  getCityArea,
  getMenuListByArea,
  getCustomizationByArea,
  getToppingByOfferItemId,
  getPaymentModesByArea,
  getStoreCategoriesOfferByAreaId,
  getProductListByOfferId,
  getAllSettings,
};
