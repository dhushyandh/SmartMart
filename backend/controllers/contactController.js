import sendEmail from "../utils/sendEmail.js";

const CONTACT_RECEIVER = "dhushyandhneduncheziyan4896@gmail.com";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    const emailSubject = subject?.trim()
      ? `SmartMart Contact: ${subject.trim()}`
      : "SmartMart Contact Message";

    const emailText = `
From: ${name}
Email: ${email}

Message:
${message}
`;

    await sendEmail({
      to: CONTACT_RECEIVER,
      subject: emailSubject,
      text: emailText,
    });

    return res.json({ success: true, message: "Message sent" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to send message. Try again later.",
    });
  }
};
