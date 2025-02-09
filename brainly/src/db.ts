import mongoose, { model, Schema, Types } from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL || "".trim();

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
// Schema for the Signin & Signup

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  firstname: String,
  lastname: String,
});
export const UserModel = model("User", UserSchema);

//Schema for the Content
const ContentSchema = new Schema({
  title: String,
  link: String,
  type: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
});

export const ContentModel = model("Content", ContentSchema);

//Schema for the Link
const LinkSchema = new Schema({
  hash: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});
export const LinkModel = model("Links", LinkSchema);
export default connectDB;
