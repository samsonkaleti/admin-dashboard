const User = require("../models/User");
const Event = require("../models/Events");

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "Student" });
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching students",
      error: error.message,
    });
  }
};

// Register student for an event
exports.registerStudentForEvent = async (req, res) => {
  const { userId, eventId } = req.body;

  try {
    // Find the student and event
    const student = await User.findById(userId);
    const event = await Event.findById(eventId);

    // Check if the student or event does not exist
    if (!student || !event) {
      return res.status(404).json({ message: "Student or Event not found" });
    }

    // Ensure that event.registeredStudents and student.eventsRegistered are arrays
    if (!Array.isArray(event.registeredStudents)) {
      event.registeredStudents = [];
    }
    if (!Array.isArray(student.eventsRegistered)) {
      student.eventsRegistered = [];
    }

    // Check if the student is already registered
    if (event.registeredStudents.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Student already registered for this event" });
    }

    // Register the student for the event
    event.registeredStudents.push(userId);
    student.eventsRegistered.push(eventId);

    // Save both the student and event
    await student.save();
    await event.save();

    return res
      .status(200)
      .json({ message: "Student successfully registered for the event" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error registering student for event",
      error: error.message,
    });
  }
};
