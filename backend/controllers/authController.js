import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

// signUp controller
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
      return res.status(400).json({ msg: "Password must be atleast 6 charector." });
    }

    if (mobile.length < 9) {
      return res.status(400).json({ msg: "Mobile Number must be atleast 10 digit." });
    }

    // hashing password
    const hashpassword = await bcrypt.hash(password, 10);

    // creating user
    user = await userModel.create({
      fullName,
      email,
      password: hashpassword,
      mobile,
      role,
    });

    // generating cookie
    let token 
    try {
      token = genToken(user._id);
    } catch (error) {
      console.log(error)
    }
    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.status(201).json(user);
  } catch (error) {
    res.status(201).json(`Sign up error ${error}`);
  }
};

// signIn controller
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User Doesn't Exist." });
    }

    // hashing Matching
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }

    // generating cookie
    let token 
    try {
      token = genToken(user._id);
    } catch (error) {
      console.log(error)
    }
    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(`Sign In error ${error}`);
  }
};

// signOut controller
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({ msg: "Logout Successfully" });
  } catch (error) {
    res.status(500).json(`SignOut error ${error}`);
  }
};


// Send OTP
export const SendOtp = async(req, res) => {
  try {
    const {email} = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User Doesn't Exist." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    user.resetOtp = otp
    user.otpExpires = Date.now()+5*60*1000         // otp expire time 
    user.isOtpVerified = false
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({msg:"OTP Send Successfully"})

  } catch (error) {
    res.status(500).json(`OTP Send error ${error}`);
  }
}

// verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const {email, otp} = req.body;

    const user = await userModel.findOne({email});

    if(!user || user.resetOtp != otp || user.otpExpires<Date.now()){
      return res.status(400).json({ msg: "Invalid/expired OTP." });
    }

    user.resetOtp = undefined
    user.otpExpires = undefined       
    user.isOtpVerified = true
    await user.save();
    return res.status(200).json({msg:"OTP Verified Successfully"})

  } catch (error) {
    res.status(500).json(`OTP Verify error ${error}`);
  }
}

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const {email, newPassword} = req.body;

    const user = await userModel.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ msg: "OTP verification Required" })
    }

    const hashpassword = await bcrypt.hash(newPassword,10);

    user.password = hashpassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({msg:"Password Reset Successfully"})

  } catch (error) {
    res.status(500).json(`Password Reset error ${error}`);
  }
}

// Google Auth
export const googleAuth = async (req, res) => {
  try {
    const {fullName, email, mobile,role} = req.body;

    let user = await userModel.findOne({email});

    if(!user){
      user =  await userModel.create({fullName, email, mobile, role})
    }

    // generating cookie
    let token 
    try {
      token = genToken(user._id);
    } catch (error) {
      console.log(error)
    }
    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});;

    res.status(201).json(user);

  } catch (error) {
    res.status(201).json(`Google Auth error ${error}`);
  }
}
