const Card = require('../models/Card'); // Adjust the path as necessary


// Create a new card
exports.createCard = async (req, res) => {
  const {
    title,
    description,
    imageUrl,
    allowAll,
    specificCollege,
    excludeCollege,
    order,
  } = req.body;

  try {
    const newCard = await Card.create({
      title,
      description,
      imageUrl,
      allowAll,
      specificCollege,
      excludeCollege,
      order,
    });
    return res
      .status(201)
      .json({ message: "Card added successfully", card: newCard });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding card", error: error.message });
  }
};



// Update card by ID
exports.updateCardById = async (req, res) => {
  const { id } = req.params;
  const { cardDetails } = req.body;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { cardDetails },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    return res.status(200).json({ message: 'Card updated successfully', card: updatedCard });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating card', error: error.message });
  }
};

// Delete card by ID
exports.deleteCardById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    return res.status(200).json({ message: 'Card deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting card', error: error.message });
  }
};
