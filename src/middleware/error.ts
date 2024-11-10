/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request, NextFunction } from "express";
import { ERRORS, STATUS_CODES } from "../constants";
import ErrorHandler from "../utils/errorHandler";
import { Status } from "../constants/string";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || STATUS_CODES.UNEXPECTED_CONDITION;
  err.message = err.message || ERRORS.INTERNAL_SERVER_DOWN;

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again.`;
    err = new ErrorHandler(message, 400);
  }

  // JWT Expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is invalid, Try again.`;
    err = new ErrorHandler(message, 400);
  }

  return res?.status(err.statusCode)?.json({
    status: Status.ERROR,
    message: err.message,
    // error: err.stack,
  });
};

export default errorMiddleware;
