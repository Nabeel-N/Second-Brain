import mongoose, { model, Schema, Types } from "mongoose";

const uri =
  "mongodb+srv://nabeel123:CMMG53HEnlUp2hs1@cluster0.ieqgqev.mongodb.net/Brainly";

// Connect to MongoDB
const mongooseconnect = mongoose.connect(uri);
mongooseconnect
  .then(() => console.log("Connected to MongoDB "))
  .catch((err) => console.error("Error connecting to MongoDB:", err));
// Schema for the Signin & Signup

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  firstname:String,
  lastname:String
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
