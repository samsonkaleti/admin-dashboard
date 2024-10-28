const PdfUpload = require('../models/PdfUpload');


exports.createPdf = async (req, res) => {
    try {
        // Extract metadata from the request body
        const { id, year, course, subject, fileName } = req.body;

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        // Create a new instance of the PdfUpload model
        const newPdf = new PdfUpload({
            id,
            year,
            course,
            subject,
            fileName,
            fileData: req.file.buffer, // Store the binary data of the uploaded PDF
            uploadDate: Date.now(),
        });

        // Save the new PDF upload to the database
        await newPdf.save();

        // Send a success response
        res.status(201).json({ message: "PDF uploaded successfully!", newPdf });
    } catch (err) {
        console.error("Error uploading PDF:", err);
        res.status(500).json({ error: "Failed to upload PDF." });
    }
};

// Get all PDFs
exports.getAllPdfs = async (req, res) => {
    try {
        const pdfs = await PdfUpload.find();
        res.status(200).json(pdfs);
    } catch (err) {
        console.error("Error fetching PDFs:", err);
        res.status(500).json({ error: "Failed to fetch PDFs." });
    }
};

// Get a PDF by ID
exports.getPdfById = async (req, res) => {
    try {
        const { id } = req.params;
        const pdf = await PdfUpload.findOne({ id });

        if (!pdf) {
            return res.status(404).json({ error: "PDF not found." });
        }

        res.status(200).json(pdf);
    } catch (err) {
        console.error("Error fetching PDF:", err);
        res.status(500).json({ error: "Failed to fetch PDF." });
    }
};

// Update a PDF by ID
exports.updatePdfById = async (req, res) => {
    try {
        const { id } = req.params;
        const { year, course, subject, fileName } = req.body;

        // Find the PDF by ID
        const pdf = await PdfUpload.findOne({ id });
        if (!pdf) {
            return res.status(404).json({ error: "PDF not found." });
        }

        // Update the fields
        pdf.year = year || pdf.year;
        pdf.course = course || pdf.course;
        pdf.subject = subject || pdf.subject;
        pdf.fileName = fileName || pdf.fileName;
        if (req.file) {
            pdf.fileData = req.file.buffer;
        }

        // Save the updated PDF
        await pdf.save();
        res.status(200).json({ message: "PDF updated successfully!", pdf });
    } catch (err) {
        console.error("Error updating PDF:", err);
        res.status(500).json({ error: "Failed to update PDF." });
    }
};

// Delete a PDF by ID
exports.deletePdfById = async (req, res) => {
    try {
        const { id } = req.params;
        const pdf = await PdfUpload.findOneAndDelete({ id });

        if (!pdf) {
            return res.status(404).json({ error: "PDF not found." });
        }

        res.status(200).json({ message: "PDF deleted successfully." });
    } catch (err) {
        console.error("Error deleting PDF:", err);
        res.status(500).json({ error: "Failed to delete PDF." });
    }
};
