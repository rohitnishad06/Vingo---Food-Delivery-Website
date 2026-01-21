import express from "express";
import { createUpdateShop, getMyShop, getShopByCity } from "../controllers/shopController.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router();

shopRouter.post("/create-edit", isAuth,upload.single("image"), createUpdateShop);
shopRouter.get("/get-my/", isAuth, getMyShop);
shopRouter.get("/get-by-city/:city", isAuth, getShopByCity);

export default shopRouter;
