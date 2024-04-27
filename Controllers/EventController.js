import Event from "../model/EventModel.js";
import jwt from "jsonwebtoken";

const eventController = {
  createEvent: async (req, res) => {
    try {
      const token = req.headers.authorization
      const user = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY);
      const userId = user.data.id;
      const { title, date, location, ticketAvailability, description } = req.body;
      const newEvent = new Event({
        user: userId,
        description,
        title,
        date,
        location,
        ticketAvailability,
      });
      await newEvent.save();
      res.status(201).json({ success: true, message: "Event created successfully", data: newEvent });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create event", error: error.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, date, location, ticketAvailability, description } = req.body;
      // if (!event) {
      //   return res.status(404).json({ success: false, message: "Event not found" });
      // }
      const updatedEvent = await Event.findByIdAndUpdate(id, { title, date, location, ticketAvailability, description, }, { new: true });
      res.status(200).json({ success: true, message: "Event updated successfully", data: updatedEvent });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update event", error: error.message });
    }
  },
  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const event = await Event.findByIdAndDelete(id);
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
      res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete event", error: error.message });
    }
  },

  getEvents: async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json({ success: true, message: "Events retrieved successfully", data: events });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve events", error: error.message });
    }
  },

  getEventsByUserId: async (req, res) => {
    try {
      const token = req.headers.authorization
      const user = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY);
      const userId = user.data.id;
      const events = await Event.find({ user: userId });
      res.status(200).json({ success: true, message: "Events retrieved successfully", data: events });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve events", error: error.message });
    }
  }

};

export { eventController };
