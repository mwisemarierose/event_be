import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [ "admin", "basic"],
    default: "basic",
    required: true,
  },
});
userSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase();
  next();
});
userSchema.pre("save", async function (next) {

  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
