import express from "express";
import  BookingController from "../Controllers/BookingController.js";
import { checkAuthorization} from "../middleware/auth.js";

const Router = express.Router();


Router.post("/:_id",checkAuthorization,BookingController.createBooking)
Router.get("/mybooking",checkAuthorization,BookingController.myBooking)
Router.delete("/cancel/:id",checkAuthorization,BookingController.cancelBooking)
Router.post("/reschedule/:id",BookingController.rescheduleBooking)


export { Router as bookingRouter };
