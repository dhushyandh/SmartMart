import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "MECH", "CIVIL", "EEE"],
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
