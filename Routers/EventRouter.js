import express from "express";
import { eventController } from "../Controllers/EventController.js";
import { checkAuthorization, checkAdmin } from "../middleware/auth.js";
const Router = express.Router();


Router.post("/", checkAuthorization, checkAdmin, eventController.createEvent)
Router.get("/all", eventController.getEvents)
Router.put("/:id", eventController.updateEvent)
Router.delete("/:id", eventController.deleteEvent)
Router.get("/user", checkAuthorization, checkAdmin, eventController.getEventsByUserId)
export { Router as eventRouter };
