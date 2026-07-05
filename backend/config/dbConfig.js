import mongoose from "mongoose";

let isConnected = false; // Track connection status

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.CONNECTION_URL);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    throw error; // Throw error so we don't proceed if it fails
  }
};

export default connectDB;
