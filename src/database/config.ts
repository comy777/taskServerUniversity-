import mongoose from "mongoose";

const dbConection = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

export default dbConection;
