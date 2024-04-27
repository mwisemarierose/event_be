import express from "express";
import User from "../model/UserModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sign} from "../Helpers/jwt.js";


dotenv.config()

class userController {

    static async register(req, res) {
        const { email, fullName, phoneNumber, password } = req.body;
        if (!email || !fullName || !password || !phoneNumber) {
          return res.status(404).json({ message: "all field required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
        try {
          const userExist = await User.findOne({ email: req.body.email });
          if (userExist) {
            return res.status(409).json({ message: "Email already exists" });
          }
      
          const user = new User(req.body);
          await user.save();
          return res.status(200).json({ message: "user created successfully", user });
        } catch (error) {
          console.log(error);
          return res.status(400).json({ error: error });
        }
      };
    static async login(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email })

            if (user) {
                const isMatch = await bcrypt.compare(req.body.password, user.password)
                if (isMatch) {
                    const token = await sign({ id: user._id, email: user.email, role: user.role })
                    user.password = null
                    return res.status(200).json({ message: "user logged in successfully", token, user })
                }

                return res.status(404).json({ error: "Password is incorrect" })

            }
    } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    }
}

export { userController };