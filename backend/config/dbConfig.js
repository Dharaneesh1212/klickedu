import mongoose from "mongoose";

const connectDB = async () => {
  // If already connected, do nothing
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If currently connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => {
      mongoose.connection.once("connected", resolve);
    });
    return mongoose.connection;
  }

  const uri = process.env.CONNECTION_URL || "mongodb+srv://dharun12122002_db_user:Wro8wvIvJNiUYHO9@klickedu.v1y4fsv.mongodb.net/?appName=klickedu";

  if (!uri) {
    throw new Error("MongoDB Connection URL is missing!");
  }

  try {
    console.log("Connecting to MongoDB...");
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false, // Don't buffer commands if connection fails
    });
    console.log("✅ Database connected successfully");
    return db;
  } catch (error) {
    console.log(`❌ Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDB;
