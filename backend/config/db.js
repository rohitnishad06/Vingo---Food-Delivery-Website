import mongoose from "mongoose"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("mongoDB Connected")
  } catch (error) {
    console.log("mongoDB Error",error);
  }
}
export default connectDB;