import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
      enum: ["user", "owner", "deliveryBoy"],
    },
    resetOtp:{
      type:String
    },
    isOtpVerified:{
      type:Boolean,
      default:false
    },
    otpExpires:{
      type:Date
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User",userSchema);

export default userModel;