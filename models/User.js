import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    hashed_password: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema, "user");
export default User;
