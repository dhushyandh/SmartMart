import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 60 * 1000, 
    socketTimeout: 60 * 1000,
  });

  return transporter.sendMail({
    from: `"SmartMart Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text: message,
  });
};

export default sendEmail;
