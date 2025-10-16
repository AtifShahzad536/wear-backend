import mongoose from 'mongoose';
import 'dotenv'
export async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wearconnect';
  if (mongoose.connection.readyState === 1) return;
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log(`[Mongo] connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}
