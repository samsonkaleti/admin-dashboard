const faiss = require("faissjs"); // FAISS library for handling vector search
const fs = require("fs");
const path = require("path");

/**
 * Load the FAISS index for a specific year, semester, subject, and unit.
 * @param {string} year - Academic year.
 * @param {string} semester - Semester.
 * @param {string} subject - Subject.
 * @param {string} unit - Unit.
 * @returns {Promise<Object>} - The FAISS index object or null if not found.
 */
async function loadFaissIndex(year, semester, subject, unit) {
  try {
    // Construct the FAISS index file path
    const indexPath = path.join(
      __dirname,
      "../indexes", // Ensure you have this folder for storing FAISS indexes
      `${year}_${semester}_${subject}_${unit}_index.faiss`
    );

    // Check if the index file exists
    if (!fs.existsSync(indexPath)) {
      console.error(`FAISS index not found at path: ${indexPath}`);
      return null;
    }

    // Load and return the FAISS index
    return faiss.readIndex(indexPath);
  } catch (err) {
    console.error("Error loading FAISS index:", err);
    throw new Error("Failed to load FAISS index.");
  }
}

/**
 * Save a FAISS index for a specific year, semester, subject, and unit.
 * @param {Object} index - The FAISS index to save.
 * @param {string} year - Academic year.
 * @param {string} semester - Semester.
 * @param {string} subject - Subject.
 * @param {string} unit - Unit.
 */
async function saveFaissIndex(index, year, semester, subject, unit) {
  try {
    // Construct the FAISS index file path
    const indexPath = path.join(
      __dirname,
      "../indexes",
      `${year}_${semester}_${subject}_${unit}_index.faiss`
    );

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(indexPath), { recursive: true });

    // Write the FAISS index to disk
    faiss.writeIndex(index, indexPath);
    console.log(`FAISS index saved at: ${indexPath}`);
  } catch (err) {
    console.error("Error saving FAISS index:", err);
    throw new Error("Failed to save FAISS index.");
  }
}

module.exports = {
  loadFaissIndex,
  saveFaissIndex,
};
