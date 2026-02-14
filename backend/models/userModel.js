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

    // geoJson for location
    location:{
      type:{type:String, enum:['Point'], default:'Point'},
      coordinates:{type:[Number],default:[0,0]}
    },
    socketId:{
      type:String
    },
    isOnline:{
      type:Boolean,
      default:false
    }

  },
  { timestamps: true }
);

// tell DB to treat location as a location type 
userSchema.index({location:"2dsphere"});  

const userModel = mongoose.model("User",userSchema);

export default userModel;