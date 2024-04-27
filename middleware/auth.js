import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verify } from "../Helpers/jwt.js";
dotenv.config();

const checkAuthorization = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const user = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
const checkAdmin = async(req,res,next) => {

    const token =  req.headers.authorization
    const user = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY);
    console.log(user)
    if(user.data.role === "admin"){
        next()           
    }
    
    else{
        return res.status(401).json({ message: "Unauthorized: You are not an admin" });
    }
    
    
  }
  
  

export { checkAuthorization,checkAdmin};
