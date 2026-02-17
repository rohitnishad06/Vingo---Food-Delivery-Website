import userModel from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ msg: "userId is not found" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({ msg: "user is not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ msg: `isAuth Error ${error}` });
  }
};


// updating user location
export const  updateUserLocation = async(req, res) =>{
  try {
    const {lon, lat} = req.body;
    const user = await userModel.findByIdAndUpdate(req.userId, {
      location:{
        type:'Point',
        coordinates:[lon, lat]
      }
    }, {new:true})

    if (!user) {
      return res.status(400).json({ msg: "user is not found" });
    }

     return res.status(200).json({msg: "Location Updated"});
  } catch (error) {
    return res.status(400).json({ msg: `user Location update Error ${error}` });
  }
}

