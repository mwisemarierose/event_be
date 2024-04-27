import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config() 

const sign = (data)=> jwt.sign({data},process.env.SECRET_KEY,{expiresIn: '72h'})
const verify = (data) => jwt.verify(data, process.env.SECRET_KEY)

export {sign, verify}