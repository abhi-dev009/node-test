import EmailOption from "../models/model";
import nodemailer from "nodemailer";

const sendEmail: any = async (options: EmailOption) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;

// MAIL_DRIVER=smtp
// MAIL_HOST=smtp.googlemail.com
// MAIL_PORT=465
// MAIL_USERNAME=infopizzatodaybill@gmail.com
// MAIL_PASSWORD=pizzatoday@7777
// MAIL_ENCRYPTION=ssl
