import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, subject, message }) => {
  await resend.emails.send({
    from: "smart-mart-in.onrender.com",
    to: email,
    subject: subject,
    text: message, 
  });
};

export default sendEmail;
