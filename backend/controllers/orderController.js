import { set } from "mongoose";
import deliveryAssignmentModel from "../models/deliveryAssignmentModel.js";
import orderModel from "../models/orderModel.js";
import shopModel from "../models/shopModel.js";
import userModel from "../models/userModel.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import Razorpay from 'razorpay'
import dotenv from 'dotenv'

dotenv.config();

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// place order
export const placeOrder = async (req, res) => {
  try {
    const { cardItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    // check card is not empty
    if (!cardItems || cardItems.length === 0) {
      return res.status(400).json({ message: "Card is Empty" });
    }

    // check complete delivery address 
    if (!deliveryAddress.text ||!deliveryAddress.latitude ||!deliveryAddress.longitude) {
      return res
        .status(400)
        .json({ message: "Send Complete Delivery Address" });
    }

    // empty obj for storing the shops items
    const groupItemsByShop = {};

    // seperate the items for their respective shop
    cardItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await shopModel.findOne({ owner: shopId }).populate("owner");

        if (!shop) {
          throw new Error(`Shop not found: ${shopId}`);
        }

        const items = groupItemsByShop[shopId];

        const subTotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );
        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotal,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      })
    );

    // online payment 
    if(paymentMethod == "online"){
      const razorOrder  = await instance.orders.create({
        amount:Math.round(totalAmount*100),     // *100 => to convert into currency
        currency:'INR',
        receipt:`receipt_${Date.now()}`
      })

      const newOrder = await orderModel.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
      razorpayOrderId: razorOrder.id,
      payment:false 
    });

    return res.status(201).json({
      razorOrder,
      orderId:newOrder._id,
      key_id: process.env.RAZORPAY_KEY_ID
    });

    }

    const newOrder = await orderModel.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
    await newOrder.populate("shopOrders.shop", "name")
    
    return res.status(201).json(newOrder);
    

  } catch (error) {
    return res.status(500).json({ message:`place order Error ${error}` });
  }
};

// verify Online payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;

    const payment = await instance.payments.fetch(razorpay_payment_id);

    if (!payment || payment.status !== "captured") {
      return res.status(400).json({ message: "Payment not Captured" });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(400).json({ message: "Order not Found" });
    }

    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    await order.populate("shopOrders.shopOrderItems.item", "name image price");
    await order.populate("shopOrders.shop", "name");

    return res.status(200).json(order);

  } catch (error) {
    return res.status(500).json({ message: `verify Order Error ${error}` });
  }
};


// get users order
export const getMyOrders = async(req, res) =>{
  try {
    const user = await userModel.findById(req.userId);
    // for user 
    if(user.role == "user"){
      const orders = await orderModel.find({user:req.userId})
    .sort({createdAt:-1})
    .populate("shopOrders.shop","name")
    .populate("shopOrders.owner","name email mobile")
    .populate("shopOrders.shopOrderItems.item","name image price")

    return res.status(201).json(orders);
    // for owner
    }else if(user.role=="owner"){
       const orders = await orderModel.find({"shopOrders.owner":req.userId})
      .sort({createdAt:-1})
      .populate("shopOrders.shop","name")
      .populate("user")
      .populate("shopOrders.shopOrderItems.item","name image price")
      .populate("shopOrders.assignedDeliveryBoy","fullName mobile")

      // filter order for shop owner
      const filteredOrders = orders.map((order=>({
        _id:order._id,
        paymentMethod:order.paymentMethod,
        user:order.user,
        shopOrders: order.shopOrders.find(o=>o.owner._id==req.userId),
        createdAt:user.createdAt,
        deliveryAddress: order.deliveryAddress,
        payment:order.payment
      })))

    return res.status(201).json(filteredOrders);
    }
    
  } catch (error) {
    return res.status(500).json({ message:`get users order Error ${error}` });
  }
}


// update order status
export const updateOrderStatus = async(req, res) =>{
  try {
    const {orderId, shopId} = req.params;
    const {status} = req.body;

    const order = await orderModel.findById(orderId);
    
    const shopOrder = order.shopOrders.find(o=>o.shop==shopId);
    if(!shopOrder){
      return res.status(400).json({message:"Shop not found"});
    }

    shopOrder.status = status;

    // finding delivery Boy near to 5km
    let deliveryBoysPayload = []
    if(status == "out of delivery" && !shopOrder.assignment){
      const {longitude, latitude } = order.deliveryAddress
      const nearByDeliveryBoy = await userModel.find({
        role:"deliveryBoy",
        location:{
          $near:{
            $geometry:{type:"Point", coordinates: [Number(longitude), Number(latitude)]},
            $maxDistance:5000       // 5km 
          }
        }
      })

      // find free delivery boy 
      const nearByIds = nearByDeliveryBoy.map(b => b._id)

      const busyIds = await deliveryAssignmentModel.find({      // busydeliveryBoys
        assignedTo:{$in:nearByIds},
        status:{$nin:["brodcasted", "completed"]}
      }).distinct("assignedTo")

      const busyIdSet = new Set(busyIds.map(id => String(id)));

      const availableBoys = nearByDeliveryBoy.filter(b => !busyIdSet.has(String(b._id)))

      const candidates = availableBoys.map(b=>b._id)

      if(candidates.length === 0){
        await order.save();
        return res.json({message: "Order Status Updated But there is no available Delivery boys"})
      }

      const deliveryAssignment = await deliveryAssignmentModel.create({
        order: order._id,
        shop:shopOrder.shop,
        shopOrderId:shopOrder._id,
        brodcastedTo:candidates,
        status:"brodcasted"
      })

      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo
      shopOrder.assignment = deliveryAssignment._id;

      // delivery Boy details
      deliveryBoysPayload = availableBoys.map(b=>({
        id: b._id,
        fullName:b.fullName,
        longitude:b.location.coordinates?.[0],
        latitude:b.location.coordinates?.[1],
        mobile:b.mobile,
      }))

    }

    await order.save();

    const updatedShopOrder = order.shopOrders.find(o=>o.shop == shopId)
    await order.populate("shopOrders.shop", "name");
    await order.populate("shopOrders.assignedDeliveryBoy", "fullName email mobile")


    return res.status(200).json({
      shopOrder:updatedShopOrder,
      assignedDeliveryBoy:updatedShopOrder?.assignedDeliveryBoy,
      availableBoys:deliveryBoysPayload,
      assignment:updatedShopOrder?.assignment._id
    });

  } catch (error) {
    return res.status(500).json({ message:`Order Update Status Error ${error}` });
  }
}


// Delivery Boy Assignment
export const getdeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    const assignments = await deliveryAssignmentModel.find({
      brodcastedTo: deliveryBoyId,
      status: "brodcasted"
    })
    .populate("order")
    .populate("shop");

    const formated = assignments
      .filter(a => a.order && a.shop)
      .map(a => {
        const shopOrder = a.order.shopOrders.find(
          so => so._id.equals(a.shopOrderId)
        );

        return {
          assignmentId: a._id,
          orderId: a.order._id,
          shopName: a.shop.name,
          deliveryAddress: a.order.deliveryAddress,
          items: shopOrder?.shopOrderItems || [],
          subTotal: shopOrder?.subTotal || 0
        };
      });

    return res.status(200).json(formated);

  } catch (error) {
    return res.status(500).json({
      message: `Get delivery Assignment Error ${error.message}`
    });
  }
};


// Accepting the order by delivery boy
export const acceptOrder = async(req, res) => {
  try {
    const {assignmentId} = req.params;
    const assignment = await deliveryAssignmentModel.findById(assignmentId);

    if(!assignment){
      return res.status(400).json({ message:"Assignment not found" });
    }

    // order expire
    if(assignment.status !== "brodcasted"){
      return res.status(400).json({ message:"Assignment is Expired" });
    }

    // check delivery Boy is already assign or not
    const alreadyAssign = await deliveryAssignmentModel.findOne({
      assignedTo:req.userId,
      status:{$nin:["brodcasted", "completed"]}
    })

    if(alreadyAssign){
       return res.status(400).json({ message:"you Are already assign to another order" });
    }

    // accepting the order 
    assignment.assignedTo = req.userId;
    assignment.status = "assigned"
    assignment.acceptedAt = new Date();
    await assignment.save()

    // find the order
    const order = await orderModel.findById(assignment.order)
    if(!order){
      return res.status(400).json({ message:"Order not found" });
    }

    let shopOrder = order.shopOrders.id(assignment.shopOrderId)
    shopOrder.assignedDeliveryBoy = req.userId;
    await order.save()

    return res.status(200).json({ message:`Order Accepted` });

  } catch (error) {
    return res.status(500).json({ message:`accept order  Error ${error}` });
  }
}

// delivery Boy Orders
export const getCurrentOrder = async(req, res) => {
  try {
    const assignment = await deliveryAssignmentModel.findOne({
      assignedTo: req.userId,
      status: "assigned"
    })
    .populate("shop", "name")
    .populate("assignedTo", "fullName email mobile location")
    .populate({
      path:"order",
      populate:[{path : "user", select: "fullName email location mobile"}]
    })

    if(!assignment){
      return res.status(500).json({ message:`Assignment Not Found` });
    }

    if(!assignment.order){
      return res.status(500).json({ message:`Order Not Found` });
    }

    const shopOrder = assignment.order.shopOrders.find(so => String(so._id) == String(assignment.shopOrderId))

    if(!shopOrder){
      return res.status(500).json({ message:`shopOrder Not Found` });
    }

    let deliveryBoyLocation = {lat: null, lon:null}
    if(assignment.assignedTo.location.coordinates.length == 2){
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1]
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0]
    }
     
    let customerLocation = {lat: null, lon:null}
    if(assignment.order.deliveryAddress){
      customerLocation.lat = assignment.order.deliveryAddress.latitude
      customerLocation.lon = assignment.order.deliveryAddress.longitude
    }

    return res.status(200).json({
      _id: assignment.order._id,
      user:assignment.order.user,
      shopOrder,
      deliveryAddress:assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation
    })
    
  } catch (error) {
    return res.status(500).json({ message:`Delivery Boy Get order  Error ${error}` });
  }
}

// get order for user by id
export const getOrderById = async(req, res) =>{
  try {
    const {orderId} = req.params;
    const order = await orderModel.findById(orderId)
    .populate("user")
    .populate({
      path: "shopOrders.shop",
      model:"Shop"
    })
    .populate({
      path: "shopOrders.assignedDeliveryBoy",
      model:"User"
    })
    .populate({
      path: "shopOrders.shopOrderItems.item",
      model:"Items"
    })
    .lean()

    if(!order){
      return res.status(400).json({message:"Order not Found"})
    }

    return res.status(200).json(order)

  } catch (error) {
    return res.status(500).json({ message:`Get Order By Id Error ${error}` });
  }
}


// delivery OTP
export const sendDeliveryOtp = async(req, res) => {
  try {
    const {orderId, shopOrderId} = req.body;
    const order = await orderModel.findById(orderId).populate("user")
    const shopOrder = order.shopOrders.id(shopOrderId)

    if(!order || !shopOrder){
      return res.status(400).json({ message:`Enter valid order/shopOrderId` });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString() 
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 5*60*1000
    await order.save();
    await sendDeliveryOtpMail(order.user, otp)

    return res.status(200).json({ message:`OTP send to ${order.user?.fullName}` });

  } catch (error) {
     return res.status(500).json({ message:`delivery Otp Error ${error}` });
  }
}

// verify delivery OTP
export const verifyDeliveryOtp = async(req, res) => {
  try {
    const {orderId, shopOrderId, otp} = req.body;
    const order = await orderModel.findById(orderId).populate("user")
    const shopOrder = order.shopOrders.id(shopOrderId)

    if(!order || !shopOrder){
      return res.status(400).json({ message:`Enter valid order/shopOrderId` });
    }

    if(shopOrder.deliveryOtp !== otp || !shopOrder.otpExpires || shopOrder.otpExpires<Date.now() ){
      return res.status(400).json({ message:`Invalid / Expired otp` });
    }

    shopOrder.status = "delivered";
    shopOrder.deliveredAt = Date.now();

    await order.save();
    await deliveryAssignmentModel.deleteOne({
      shopOrderId: shopOrder._id,
      order: order._id,
      assignedTo : shopOrder.assignedDeliveryBoy
    })

    return res.status(200).json({ message:`Order Delivered Successfully` });

  } catch (error) {
     return res.status(500).json({ message:`verify delivery Otp Error ${error}` });
  }
}