import shopModel from "../models/shopModel.js";
import uploadCloudinary from "../utils/cloudinary.js";


// creating and updating shop
export const createUpdateShop = async(req, res) =>{
  try {
    const {name, state, city, address} = req.body

    //uploading file path to cloude
    let image;
    if(req.file){
      image = await uploadCloudinary(req.file.path)
    }

    // creating or updating shop
    let shop = await shopModel.findOne({owner:req.userId})
    if (!shop) {
        shop = await shopModel.create({name,city ,state, address, image, owner:req.userId   })
    } else {
      shop = await shopModel.findByIdAndUpdate(shop._id,{name,city ,state, address, image, owner:req.userId},{new:true})
    }

    // populateing owner
    await shop.populate("owner items")

    return res.status(201).json(shop);

  } catch (error) {
    return res.status(500).json({msg:`create shop error ${error}`});
  }
}

// get my shop
export const getMyShop = async(req, res) =>{
  try {
    const shop = await shopModel.findOne({owner:req.userId})
    if(!shop){
      return res.status(404).json({
        msg: "Shop not found",
        shop: null
        });
    }

    await shop.populate("owner")
    await shop.populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })
    

    return res.status(200).json(shop);

  } catch (error) {
    return res.status(500).json({msg:`get My shop error ${error}`});
  }
}

// get shop by city 
export const getShopByCity = async(req, res) =>{
  try {
    const {city} = req.params

    const shops = await shopModel.find({
      city:{$regex:new RegExp(`^${city}$`,"i")}
    }).populate('items')

    if(!shops){
      return res.status(400).json({msg: "Shops not found"});
    }

    return res.status(200).json(shops)

    
  } catch (error) {
    return res.status(500).json({msg:`get shop by city error ${error}`});
  }
}