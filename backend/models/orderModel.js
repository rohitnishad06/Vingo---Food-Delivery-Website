import mongoose from "mongoose";

// shop order item schema
const shopOrderItemsSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Items",
      required:true
    },
    name:String,
    price: Number,
    quantity: Number,
  },
  { timestamps: true },
);


// shop order schema
const shopOrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subTotal: Number,
    shopOrderItems: [shopOrderItemsSchema],
    status:{
      type:String,
      enum:["pending", "preparing", "out of delivery","delivered"],
      default:"pending"
    }
  },
  { timestamps: true },
);


// order schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enm: ["cod", "online"],
      required: true,
    },
    deliveryAddress: {
      text: String,
      latitude: Number,
      longitude: Number,
    },
    totalAmount: {
      type: Number,
    },
    shopOrders: [shopOrderSchema],
  },
  { timestamps: true },
);

const orderModel = mongoose.model("Order",orderSchema);

export default orderModel;
