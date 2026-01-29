import orderModel from "../models/orderModel.js";
import shopModel from "../models/shopModel.js";
import userModel from "../models/userModel.js";

// place order
export const placeOrder = async (req, res) => {
  try {
    const { cardItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    // check card is not empty
    if (cardItems == 0 || !cardItems) {
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
            price: i._price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      })
    );

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

      // filter order for shop owner
      const filteredOrders = orders.map((order=>({
        _id:order._id,
        paymentMethod:order.paymentMethod,
        user:order.user,
        shopOrders: order.shopOrders.find(o=>o.owner._id==req.userId),
        createdAt:user.createdAt,
        deliveryAddress: order.deliveryAddress
      })))

    return res.status(201).json(filteredOrders);
    }
    
  } catch (error) {
    return res.status(500).json({ message:`get users order Error ${error}` });
  }
}

