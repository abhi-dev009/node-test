import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants";
import catchAsyncErrors from "./catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../connector/connector";
import { verifyToken } from "../utils/helper";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAuthenticatedUser: any = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      return next(
        new ErrorHandler(
          "Please Login to access this resource",
          STATUS_CODES.UNAUTHORIZED_ACCESS
        )
      );
    }
    const decodedToken: any = verifyToken(token);

    if (decodedToken && decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      if (decodedToken.exp < currentTime) {
        return next(
          new ErrorHandler(
            "Token has expired",
            STATUS_CODES.UNAUTHORIZED_ACCESS
          )
        );
      }
    }

    const user = await prisma.users.findFirst({
      where: { id: Number(decodedToken.userId) },
      select: {
        id: true,
        name: true,
        email: true,
        is_email_verified: true,
        is_mobile_verified: true,
        mobile: true,
      },
    });
    if (!user) {
      return next(
        new ErrorHandler("Please Login to access this resource", 401)
      );
    }

    // req.body = { ...req.body, user };
    next();
  }
);

export default isAuthenticatedUser;
