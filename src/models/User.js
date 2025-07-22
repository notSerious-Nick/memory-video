import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
  },
  socialOnly: {
    type: Boolean,
    default: false,
  },
  avatarUrl: String,
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const saltRounds = 6;
  const hash = await bcrypt.hash(this.password, saltRounds);
  this.password = hash;
});

const User = mongoose.model("User", userSchema);

export default User;
