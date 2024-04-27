import express from "express";
import Booking from "../model/BookingModel.js";
import Event from "../model/EventModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
class BookingController {

  static async createBooking(req, res) {
    try {
      const { numTickets } = req.body;
      const eventId = req.params._id
      const token = req.headers.authorization
      const user = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY);
      const userId = user.data.id;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      if (event.ticketAvailability < numTickets) {
        return res.status(400).json({ error: "Insufficient tickets available" });
      }

      const booking = new Booking({ event: eventId, user: userId, numTickets });
      await booking.save();

      event.ticketAvailability -= numTickets;
      await event.save();

      res.status(201).json({ message: "Booking created successfully", booking });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async myBooking(req, res) {
    try {
      const token = req.headers.authorization
      const user = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY);
      const userId = user.data.id;
      const booking = await Booking.find({ user: userId }).populate("event");
      res.status(200).json({ message: "Booking retrieved successfully", booking });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cancelBooking(req, res) {
    try {
      const { id } = req.params;
      const booking = await Booking.findByIdAndDelete(id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      const event = await Event.findById(booking.event._id);
      event.ticketAvailability += booking.numTickets;
      await event.save();
      res.status(200).json({ message: "Booking cancelled successfully" });

    } catch (error) {
      console.log(error);
    }
  }

  static async rescheduleBooking(req, res) {
    try {
      const { id } = req.params;
      const { numTickets } = req.body;
      const booking = await Booking.findById(id);
      console.log("booking", booking)
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      const event = await Event.findById(booking.event._id);
      console.log("event", event)
      if (event.ticketAvailability < numTickets) {
        return res.status(400).json({ error: "Insufficient tickets available" });
      }
      event.ticketAvailability += booking.numTickets;
      event.ticketAvailability -= numTickets;
      await event.save();
      booking.numTickets = numTickets;
      await booking.save();
      res.status(200).json({ message: "Booking rescheduled successfully", booking });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  }

}
export default BookingController;
