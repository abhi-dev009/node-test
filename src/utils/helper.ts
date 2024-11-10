import jwt from "jsonwebtoken";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import config from "../config";

const generateToken = (id: number) => {
  return jwt.sign({ userId: id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};
const verifyToken = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET);
};

const todayDate = (date: Date) => {
  return todayDateTime(date).substring(0, 10) + " 00:00:00.000Z";
};

const todayDateTime = (date: Date) => {
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const istDate = new Date(date.getTime() + istOffset);

  return istDate.toISOString();
};

const displayDateTime = (date: Date) => {
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const istDate = new Date(date.getTime() - istOffset);

  return istDate;
};

const timeToSeconds = (time: any) => {
  // time (hh:mm:ss)
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};
const formatShortDate = (date: any) => {
  // 12 Aug 2024
  const newDate = displayDateTime(date);
  const options: any = { day: "2-digit", month: "short", year: "numeric" };
  return newDate.toLocaleDateString("en-GB", options);
};

const getCurrentTime = (date: any) => {
  const newDate = displayDateTime(date);
  const hours = String(newDate.getHours()).padStart(2, "0"); // Get hours and pad with leading zero
  const minutes = String(newDate.getMinutes()).padStart(2, "0"); // Get minutes and pad with leading zero
  return `${hours}:${minutes}`;
};

const getTimeFromDate = (timestamp: any) => {
  // timestamp should be in toISOString ex. "1970-01-01T00:01:00.000Z"
  // return time(hh:mm:ss)
  const date = new Date(timestamp);

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  return `${hours}:${minutes}:${seconds}`;
};

const checkTimeBetweenTimeRange = (
  timeToCheck: any, // hh:mm:ss
  startTime: any,
  endTime: any
) => {
  // Convert times to minutes since midnight
  let checkMinutes = timeToSeconds(timeToCheck);
  let startMinutes = timeToSeconds(startTime);
  let endMinutes = timeToSeconds(endTime);

  // Check if the time falls between the start and end time
  return checkMinutes >= startMinutes && checkMinutes <= endMinutes;
};

const checkFileType = function (
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cb: FileFilterCallback | any
) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: please upload jpeg, jpg, png file only!!");
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads");
  },
  filename: function (req, file, cb) {
    console.log({ file });
    cb(null, `Pizzatoday-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10 mb
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const generateCustId = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hours = ("0" + date.getHours()).slice(-2);
  let minutes = ("0" + date.getMinutes()).slice(-2);
  let seconds = ("0" + date.getSeconds()).slice(-2);

  let dateTime = year + month + day + hours + minutes + seconds;

  let randomNum = Math.floor(Math.random() * (99999999 - 10000 + 1)) + 10000;

  let custId = dateTime + randomNum;

  return custId;
};

const generateUniqueCode = (length: number) => {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = alphabets[Math.floor(Math.random() * alphabets.length)]; // Ensure the first character is an alphabet
  for (let i = 1; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

const generateLoginOTPMessage = (otp: number): string => {
  return `Your Pizza Today Login OTP is ${otp}`;
};
const generateOrderMessage = (order_no: string, amount: number): string => {
  return `Thanks for choosing Pizza Today . 'Your order no is  ${order_no} Amount:  Rs. ${amount} Will deliver your order soon.  Team Pizza Today.`;
};
const generateEmailForOtpVerification = (otp: number): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #d32f2f;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 30px;
            text-align: center;
        }
        .email-body h1 {
            color: #d32f2f;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #d32f2f;
            letter-spacing: 5px;
            margin: 20px 0;
        }
        .email-footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #888888;
            background-color: #f1f1f1;
        }
        .email-footer a {
            color: #d32f2f;
            text-decoration: none;
        }
        .email-footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Pizza Today</h1>
        </div>
        <div class="email-body">
            <h1>Your Login OTP</h1>
            <p>Use the below code to verify your account:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for the next 10 minutes.</p>
            <p>If you did not request this OTP, please contact our support team immediately.</p>
        </div>
        <div class="email-footer">
            <p>Thank you for choosing Pizza Today!</p>
            <p><a href="https://pizzatoday.in/privacy_policy">Privacy Policy</a> | <a href="https://pizzatoday.in/contactus">Contact Us</a></p>
        </div>
    </div>
</body>
</html>`;
};
const generateEmailForOrderConfirmation = (
  productList: any,
  order: any,
  user: any,
  area: any,
  area_tax: any,
  address: string | undefined | null,
  payment_method: string
): string => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pizza Order Confirmation</title>
    <style>
      body {
        font-family: "Arial", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #fdf3e7; /* Warm beige for a cozy background */
      }
      .email-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #000000; /* Pizza red */
        padding: 20px;
        text-align: center;
      }
      .header img {
        height: 90px;
      }
      .content {
        background-color: #fefae0; /* Light warm yellow */
        padding: 20px;
      }
      .content h1 {
        color: #e63946;
        font-size: 24px;
        margin: 0;
      }
      .content h3 {
        color: #007063;
      }
      .content p {
        color: #8c0000;
        font-size: 16px;
        margin: 10px 0 20px;
        font-weight: 600;
        opacity: 0.9;
      }
      .order-confirmation {
        background-color: #046608; /* Deep blue for contrast */
        color: white;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
      }
      .order-confirmation h2 {
        margin: 0;
        font-size: 22px;
      }
      .order-confirmation .heading {
        display: flex;
      }
      .heading .left-text{
        display: inline-block; 
        width: 49%;
        text-align: left;
      } 
      .heading .right-text{
        display: inline-block;
        width: 49%;
        text-align: right;
      } 
      .order-details {
        display: flex;
        justify-content: space-between;
        margin: 15px 0;
      }
      .order-details span {
        font-size: 14px;
        width: 33.33%;
        padding-right: 8px;
        color: #ffffff;
      }
      .items-table,
      .summary-table {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
      }
      .items-table th,
      .items-table td,
      .summary-table td {
        padding: 10px;
        text-align: left;
      }
      .items-table th {
        background-color: #ffba08; /* Golden yellow for a pizza vibe */
        color: #1d3557;
      }
      .items-table td {
        border-bottom: 1px solid #ffba08;
      }
      .summary-table {
        margin-top: 10px;
      }
      .summary-table td {
        padding: 5px 0;
        font-size: 14px;
      }
      .summary-table td:nth-child(2) {
        text-align: right;
      }
      .footer {
        background-color: #000000;
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 14px;
      }
      .footer p {
        margin: 0;
      }
      .customer-address {
        font-weight: 600;
        opacity: 0.9;
        color: #8c0000;
      }
      .area-address {
        font-size: 16px;
        line-height: 1.3;
        font-weight: 600;
        opacity: 0.8;
        color: #8c0000;
      }
      .customer-care {
        background-color: #ffba08;
        padding: 21px 0;
        text-align: center;
        font-size: 26px;
        font-weight: 600;
        margin-bottom: 0;
      }
      .customer-care span {
        letter-spacing: 4px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <img
          src="https://pizzatoday.in/web/images/website-logo.png"
          alt="Pizza Today Logo"
        />
      </div>

      <!-- Content -->
      <div class="content">
        <h1>Hi ${user.name.split(" ")[0]},</h1>
        <p>
          Thank you for your order! We're preparing your delicious order and
          will have it delivered to you soon.
        </p>

        <!-- Order Confirmation Block -->
        <div class="order-confirmation">
          <div class="heading"> 
            <h2 class="left-text">Order Confirmed</h2>
            <h2 class="right-text">${
              order.order_type == "delivery" || order.order_type == "DELIVERY"
                ? "Delivery"
                : "Take Away"
            }</h2>
          </div>
          <div class="order-details">
            <span>Order No: ${order.order_number}</span>
            <span>Date: ${formatShortDate(order.created_at)}</span>
            <span>Time: ${getCurrentTime(order.created_at)}</span>
          </div>
          <div class="order-details">
            <span>Payment Mode: ${payment_method}</span
            ><span
              >Payment Status: ${
                payment_method == "COD" ? "Pending" : "Paid"
              }</span
            >
            <span>GST: ${area_tax ? area_tax?.gst_no : "-"}</span>
          </div>
        </div>

        <!-- Order Items -->
        <h3>Order Details</h3>
        <table class="items-table">
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        
            ${productList
              .map(
                (product: any) => `
                  <tr>
                    <td>${product.name}</td>
                    <td>${product.qty}</td>
                    <td>Rs. ${product.price}</td>
                  </tr>
                `
              )
              .join("")}
          
        </table>

        <!-- Order Summary -->
        <h3>Order Summary</h3>
        <table class="summary-table">
          <tr>
            <td>Sub Total</td>
            <td>Rs. ${order.sub_total}</td>
          </tr>
          <tr>
            <td>Discount</td>
            <td>- Rs. ${order.discount_amount}</td>
          </tr>
          <tr>
            <td>TAX & Charges</td>
            <td>Rs. ${order.tax_amount}</td>
          </tr>
          <tr>
            <td>Delivery Charges</td>
            <td>Rs. ${order.delivery_fee}</td>
          </tr>
          <tr>
            <td><strong>Grand Total</strong></td>
            <td><strong>Rs. ${order.grand_total}</strong></td>
          </tr>
        </table>

        <!-- Restaurant Address -->
        <h3>Pizza Today Restaurant Address</h3>
        <p class="area-address">
          ${area.name} <br />
          ${area.address}<br />
          Contact: ${area.contact_no} <br />
          Email: info@pizzatoday.in
        </p>
      </div>
      <div class="customer-care">Customer Care: <span> 8989586868</span></div>

      <!-- Footer -->
      <div class="footer">
        <p>
          Thank you! <br />
          Team Pizza Today
        </p>
      </div>
    </div>
  </body>
</html>
`;
};
const generateEmailForResetPasswordOtp = (otp: number): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #d32f2f;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 30px;
            text-align: center;
        }
        .email-body h2 {
            color: #d32f2f;
            font-size: 20px;
            margin-bottom: 20px;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #d32f2f;
            letter-spacing: 5px;
            margin: 20px 0;
        }
        .email-body p {
            margin: 10px 0;
            line-height: 1.6;
        }
        .reset-instructions {
            font-size: 14px;
            color: #666666;
            margin-top: 20px;
        }
        .email-footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #888888;
            background-color: #f1f1f1;
        }
        .email-footer a {
            color: #d32f2f;
            text-decoration: none;
        }
        .email-footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Pizza Today</h1>
        </div>
        <div class="email-body">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password for your Pizza Today account.</p>
            <p>Please use the below OTP to reset your password:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for the next 10 minutes.</p>
            <p>If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
            <div class="reset-instructions">
                <p>For security reasons, never share this OTP with anyone.</p>
            </div>
        </div>
        <div class="email-footer">
            <p>Thank you for choosing Pizza Today!</p>
            <p><a href="https://pizzatoday.in/privacy_policy">Privacy Policy</a> | <a href="https://pizzatoday.in/contactus">Contact Us</a></p>
        </div>
    </div>
</body>
</html>
`;
};

export {
  generateToken,
  upload,
  generateCustId,
  generateUniqueCode,
  generateLoginOTPMessage,
  generateOrderMessage,
  generateEmailForOtpVerification,
  generateEmailForOrderConfirmation,
  generateEmailForResetPasswordOtp,
  verifyToken,
  todayDate,
  todayDateTime,
  checkTimeBetweenTimeRange,
  getTimeFromDate,
  formatShortDate,
  getCurrentTime,
};
