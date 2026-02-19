import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Vingo",
          email: process.env.EMAIL, // verified sender email in Brevo
        },
        to: [{ email: to }],
        subject,
        htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Brevo Email Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send email");
  }
};

// Password Reset OTP
export const sendOtpMail = async (to, otp) => {
  await sendEmail(
    to,
    "Reset Your Password",
    `<p>Your OTP for Password Reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
  );
};

// Delivery OTP
export const sendDeliveryOtpMail = async (user, otp) => {
  await sendEmail(
    user.email,
    "Delivery OTP",
    `<p>Your OTP for Delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`
  );
};
