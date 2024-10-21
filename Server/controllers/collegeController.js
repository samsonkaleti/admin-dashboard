const College = require('../models/Colleges'); // Adjust the path as necessary

// Create a new college
exports.createCollege = async (req, res) => {
  const { collegeName, regulatoryBody, domain, details, programs } = req.body;

  try {
    const newCollege = await College.create({
      collegeName,
      regulatoryBody,
      domain,
      details,
      programs,
    });
    return res.status(201).json({ message: 'College created successfully', college: newCollege });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating college', error: error.message });
  }
};

// Get all colleges
exports.getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    return res.status(200).json(colleges);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching colleges', error: error.message });
  }
};

// Get college by ID
exports.getCollegeById = async (req, res) => {
  const { id } = req.params;

  try {
    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    return res.status(200).json(college);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching college', error: error.message });
  }
};

// Update college by ID
exports.updateCollegeById = async (req, res) => {
  const { id } = req.params;
  const { collegeName, regulatoryBody, domain, details, programs } = req.body;

  try {
    const updatedCollege = await College.findByIdAndUpdate(
      id,
      { collegeName, regulatoryBody, domain, details, programs },
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    if (!updatedCollege) {
      return res.status(404).json({ message: 'College not found' });
    }

    return res.status(200).json({ message: 'College updated successfully', college: updatedCollege });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating college', error: error.message });
  }
};

// Delete college by ID
exports.deleteCollegeById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCollege = await College.findByIdAndDelete(id);
    if (!deletedCollege) {
      return res.status(404).json({ message: 'College not found' });
    }
    return res.status(200).json({ message: 'College deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting college', error: error.message });
  }
};
exports.getCollegeByCollegeName = async (req, res) => {
    const { collegeName } = req.params; // Extract collegeName from the request params
  
    try {
      const college = await College.findOne({ collegeName: collegeName });
      if (!college) {
        return res.status(404).json({ message: 'College not found' });
      }
      return res.status(200).json(college);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching college', error: error.message });
    }
  };
  
  // Update a college by collegeName
  exports.updateCollegeByCollegeName = async (req, res) => {
    const { collegeName } = req.params; // Extract collegeName from the request params
    const { regulatoryBody, domain, details, programs } = req.body; // Extract fields to update
  
    try {
      const updatedCollege = await College.findOneAndUpdate(
        { collegeName: collegeName }, // Find college by collegeName
        { regulatoryBody, domain, details, programs }, // Fields to update
        { new: true, runValidators: true } // Return updated document and run validation
      );
  
      if (!updatedCollege) {
        return res.status(404).json({ message: 'College not found' });
      }
  
      return res.status(200).json({ message: 'College updated successfully', college: updatedCollege });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating college', error: error.message });
    }
  };
  
  // Delete a college by collegeName
  exports.deleteCollegeByCollegeName = async (req, res) => {
    const { collegeName } = req.params; // Extract collegeName from the request params
  
    try {
      const deletedCollege = await College.findOneAndDelete({ collegeName: collegeName });
      if (!deletedCollege) {
        return res.status(404).json({ message: 'College not found' });
      }
      return res.status(200).json({ message: 'College deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting college', error: error.message });
    }
  };