import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";


// ================= SIGN UP =================
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User Already Exist." });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be atleast 6 character." });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    user = await userModel.create({
      fullName,
      email,
      password: hashpassword,
      mobile,
      role,
    });

    const token = genToken(user._id);

    return res.status(201).json({
      user,
      token,
    });

  } catch (error) {
    return res.status(500).json({ msg: `Sign up error ${error}` });
  }
};


// ================= SIGN IN =================
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User Doesn't Exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }

    const token = genToken(user._id);

    return res.status(200).json({
      user,
      token,
    });

  } catch (error) {
    return res.status(500).json({ msg: `Sign In error ${error}` });
  }
};


// ================= LOGOUT =================
// Backend logout optional now
export const signOut = async (req, res) => {
  return res.status(200).json({ msg: "Logout Successfully" });
};


// ================= SEND OTP =================
export const SendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User Doesn't Exist." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();
    await sendOtpMail(email, otp);

    return res.status(200).json({ msg: "OTP Send Successfully" });

  } catch (error) {
    return res.status(500).json({ msg: `OTP Send error ${error}` });
  }
};


// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid/expired OTP." });
    }

    user.resetOtp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerified = true;

    await user.save();

    return res.status(200).json({ msg: "OTP Verified Successfully" });

  } catch (error) {
    return res.status(500).json({ msg: `OTP Verify error ${error}` });
  }
};


// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await userModel.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ msg: "OTP verification Required" });
    }

    const hashpassword = await bcrypt.hash(newPassword, 10);

    user.password = hashpassword;
    user.isOtpVerified = false;

    await user.save();

    return res.status(200).json({ msg: "Password Reset Successfully" });

  } catch (error) {
    return res.status(500).json({ msg: `Password Reset error ${error}` });
  }
};


// ================= GOOGLE AUTH =================
export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({ fullName, email, mobile, role });
    }

    const token = genToken(user._id);

    return res.status(201).json({
      user,
      token,
    });

  } catch (error) {
    return res.status(500).json({ msg: `Google Auth error ${error}` });
  }
};
