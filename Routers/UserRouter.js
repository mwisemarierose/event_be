import express from "express";
import  {userController}  from "../Controllers/UserController.js";

const Router = express.Router();


Router.post("/register",userController.register)
Router.post("/login",userController.login)
export { Router as userRouter };
