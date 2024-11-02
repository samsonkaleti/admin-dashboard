const Event = require("../models/Events");

exports.createEvent = async (req, res) => {
  try {
    const { title, collegeName, address, time, thumbnail, eventSpeaker } = req.body;
    const newEvent = new Event({
      title,
      collegeName,
      address,
      time,
      thumbnail,
      eventSpeaker,
    });
    const savedEvent = await newEvent.save();
    res.status(201).json({
      message: "Event created successfully!",
      data: savedEvent,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error creating event.",
      error: err.message,
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      message: "All events retrieved successfully.",
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error retrieving all events.",
      error: error.message,
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        message: `Event with ID ${req.params.id} not found. Please check the ID and try again.`,
      });
    }
    res.status(200).json({
      message: "Event retrieved successfully!",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve event. Please check the ID format and try again.",
      error: error.message,
    });
  }
};

exports.updateEventById = async (req, res) => {
  try {
    const { title, collegeName, address, time, thumbnail, eventSpeaker } = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, collegeName, address, time, thumbnail, eventSpeaker },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        message: `Event with ID ${req.params.id} not found. Please check the ID and try again.`,
      });
    }
    res.status(200).json({
      message: "Event updated successfully!",
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update event. Please check your input and try again.",
      error: error.message,
    });
  }
};

exports.deleteEventById = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({
        message: `Event with ID ${req.params.id} not found. Please check the ID and try again.`,
      });
    }

    res.status(200).json({
      message: "Event deleted successfully!",
      data: deletedEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting event.",
      error: error.message,
    });
  }
};
