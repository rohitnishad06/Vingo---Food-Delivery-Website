
import itemModel from "../models/itemmodel.js";
import shopModel from "../models/shopModel.js";
import uploadCloudinary from "../utils/cloudinary.js";

// add items
export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;

    //uploading file path to cloude
    let image;
    if (req.file) {
      image = await uploadCloudinary(req.file.path);
    }

    // finding shop
    const shop = await shopModel.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(400).json({ msg: "Shop not Found" });
    }

    // adding item
    const item = await itemModel.create({
      name,
      owner: req.userId,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("owner")
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ msg: `add item error ${error}` });
  }
};

// edit items
export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;

    //uploading file path to cloude
    let image;
    if (req.file) {
      image = await uploadCloudinary(req.file.path);
    }

    // Editing item
    const item = await itemModel.findByIdAndUpdate(
      itemId,
      { name, category, foodType, price, image },
      { new: true }
    );

    if (!item) {
      return res.status(400).json({ msg: "item not Found" });
    }

    const shop = await shopModel.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ msg: `edit item error ${error}` });
  }
};

// get item by id
export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const item = await itemModel.findById(itemId);

    if (!item) {
      return res.status(400).json({ msg: "item not Found" });
    }

    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ msg: `get item error ${error}` });
  }
};

// delete item
export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const item = await itemModel.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ msg: "item not Found" });
    }

    const shop = await shopModel.findOne({ owner: req.userId });
    shop.items = shop.items.filter((i) => i._id !== item._id);
    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ msg: `Delete item error ${error}` });
  }
};

// get item by city
export const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const shops = await shopModel.find({
      city: { $regex: new RegExp(`^${city}$`, "i") }
    });

    if (!shops)
      return res.status(404).json({ msg: "No shops found" });

    // 🔥 Extract OWNER IDs instead of SHOP IDs
    const ownerIds = shops.map(shop => shop.owner);

    const items = await itemModel.find({
      owner: { $in: ownerIds }
    });

    return res.status(200).json(items);

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// get items by shop
export const getItemsByShop = async(req, res) => {
  try {
    const {shopId} = req.params
    const shop = await shopModel.findById(shopId).populate('items')
    if(!shop){
      return res.status(400).json({message:"Shop not found"});
    }
    return res.status(200).json({
      shop, items: shop.items
    })
  } catch (error) {
    return res.status(500).json({ msg: `get item by shop error ${error}` });
  }
}