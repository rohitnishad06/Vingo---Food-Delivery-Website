import express from "express";
import { completeProfile, googleAuth, resetPassword, SendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/authController.js";
import isAuth from "../middlewares/isAuth.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signIn", signIn);
authRouter.get("/signOut", signOut);
authRouter.post("/send-otp", SendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google-auth", googleAuth);
authRouter.post("/complete-profile", isAuth ,completeProfile);

export default authRouter;
