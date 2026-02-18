import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import shopRouter from "./routes/shopRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import http from 'http';
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";


dotenv.config();

const app = express();

// for deployment on render 
app.set("trust proxy", 1);


// for socket.io integration 
const server = http.createServer(app)
const io = new Server(server,{
  cors:{
    origin: "*",
    credentials: true,
    methods:['POST','GET'] 
  }
})
app.set("io",io)

const port = process.env.PORT || 5000;

// global middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

socketHandler(io);
server.listen(port, () => {
  connectDB();
  console.log(`Server is Running on Port ${8000}`);
});
