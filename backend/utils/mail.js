import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // 'service: Gmail' ki jagah host use karna better hota hai
  port: 587,              // 465 ki jagah 587 use karein frr production
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false // Ye line cloud servers par connection timeout rokne mein help karti hai
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("Transporter Verification Error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export const sendOtpMail = async(to,otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject:"Reset Your Password",
    html:`<p>Your OTP for Password Reset is <b>${otp}</b>. It Expires in 5 minutes. </p>`
  })
}


export const sendDeliveryOtpMail = async(user,otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject:"Delivery OTP",
    html:`<p>Your OTP for Delivery is <b>${otp}</b>. It Expires in 5 minutes. </p>`
  })
}
