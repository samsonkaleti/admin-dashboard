const User = require("../models/User");

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "Student" });
    return res.status(200).json(students);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
};
