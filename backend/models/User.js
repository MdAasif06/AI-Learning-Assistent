import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please provide a username"],
      unique: true,
      trim: true,
      minLength: [3, "username must be at least 3 character long"],
    },
    email: {
      type: String,
      required: [true, "please provide a password"],
      minLength: [6, "proassord msut be at least 6 character long"],
      select: false,
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

//Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password method
userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
