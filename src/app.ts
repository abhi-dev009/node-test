import express from "express";
// import createError from "http-errors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import errorMiddleware from "./middleware/error";

import { fileURLToPath } from "url";
import { STRINGS } from "./constants/string";
import { API_VERSION, ALL_ROUTES } from "./routes";
import { upload } from "./utils/helper";
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send(`${STRINGS.EXPRESS_RUNNING}${process.env.NODE_ENV}`);
});
app.post("/uploadImage", upload.single("profile_pic"),(req, res) => {
  res.send(`uploaded image successfully`);
});



app.use(API_VERSION, ALL_ROUTES);

// error handler
app.use(errorMiddleware);
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

export default app;
