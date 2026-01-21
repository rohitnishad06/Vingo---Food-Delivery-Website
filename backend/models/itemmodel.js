import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Snacks",
        "Main Course",
        "Desserets",
        "Pizza",
        "Burgurs",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "Other",
      ],
      required: true,
    },
    price:{
      type:Number,
      required:true,
      min:0
    },
    foodType:{
      type:String,
      required:true,
      enum:["veg","non-veg"]
    },
    rating:{
      average:{type:Number, default:0},
      count:{type:Number, default:0},

    }
  },
  { timestamps: true }
);

const itemModel = mongoose.model("Items",itemSchema);

export default itemModel;