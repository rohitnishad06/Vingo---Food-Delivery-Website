import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import shopRouter from "./routes/shopRoutes.js";
import itemRouter from "./routes/itemRoutes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

// global middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);


app.listen(port, () => {
  connectDB();
  console.log(`Server is Running on Port ${8000}`);
});
