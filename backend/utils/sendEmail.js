import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text }) => {
  try {
    const result = await resend.emails.send({
      from: "smart-mart-in.onrender.com",
      to,
      subject,
      text,
    });

    console.log("📧 Email queued:", result.id);
    return true;

  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    return false;
  }
};

export default sendEmail;
