import orderModel from "../models/orderModel.js";
import shopModel from "../models/shopModel.js";

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
            item: i._id,
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
    
    return res.status(201).json(newOrder);
    

  } catch (error) {
    return res.status(500).json({ message:`place order Error ${error}` });
  }
};
