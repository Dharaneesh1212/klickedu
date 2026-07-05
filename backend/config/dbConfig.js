import mongoose from "mongoose";

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  // Fallback to local .env value if Vercel environment variable is missing (for debugging)
  const uri = process.env.CONNECTION_URL || "mongodb+srv://dharun12122002_db_user:Wro8wvIvJNiUYHO9@klickedu.v1y4fsv.mongodb.net/?appName=klickedu";

  if (!uri) {
    throw new Error("MongoDB Connection URL is missing!");
  }

  try {
    console.log("Connecting to MongoDB...");
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging Vercel
    });
    cachedDb = db;
    console.log("✅ Database connected successfully");
    return db;
  } catch (error) {
    console.log(`❌ Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDB;
