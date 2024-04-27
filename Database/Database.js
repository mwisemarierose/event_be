import mongoose from 'mongoose'
import dotenv from "dotenv"

dotenv.config()
const dbURL   = process.env.dbURL

const database = async()=>{
    try {
     await mongoose.connect(dbURL, {useNewUrlParser: true}).then(()=>{
        console.log("database connected successfully")
     })
    } catch (error) {
        console.log(error)
    }

}



export default database;