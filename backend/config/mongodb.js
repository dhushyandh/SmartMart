import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('DB CONNECTED');

  } catch (error) {
    console.error('DB CONNECTION FAILED:', error.message);
    process.exit(1);
  }
};

export default connectDB;
