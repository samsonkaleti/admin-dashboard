const PdfUpload = require('../models/PdfUpload');

const pdfController = {
    // Create PDF
    createPdf: async (req, res) => {
        try {
            // Check if file exists
            if (!req.file) {
                return res.status(400).json({ error: "Please upload a PDF file" });
            }

            // Validate file type
            if (req.file.mimetype !== 'application/pdf') {
                return res.status(400).json({ error: "Only PDF files are allowed" });
            }

            // Extract data from request
            const { year, course, subject } = req.body;
            
            // Validate required fields
            if (!year || !course || !subject) {
                return res.status(400).json({ 
                    error: "Year, course, and subject are required" 
                });
            }

            // Generate unique ID
            const id = Date.now();

            // Create new PDF document
            const newPdf = new PdfUpload({
                id,
                year,
                course,
                subject,
                fileName: req.file.originalname,
                fileData: req.file.buffer
            });

            await newPdf.save();

            res.status(201).json({
                message: "PDF uploaded successfully",
                pdf: {
                    id: newPdf.id,
                    year: newPdf.year,
                    course: newPdf.course,
                    subject: newPdf.subject,
                    fileName: newPdf.fileName,
                    uploadDate: newPdf.uploadDate
                }
            });
        } catch (err) {
            console.error("Error uploading PDF:", err);
            res.status(500).json({ error: "Failed to upload PDF" });
        }
    },

    // Get all PDFs
    getAllPdfs: async (req, res) => {
        try {
            const pdfs = await PdfUpload.find().select('-fileData');
            res.status(200).json(pdfs);
        } catch (err) {
            console.error("Error fetching PDFs:", err);
            res.status(500).json({ error: "Failed to fetch PDFs" });
        }
    },

    // Update PDF
    updatePdfById: async (req, res) => {
        try {
            const { id } = req.params;
            const { year, course, subject } = req.body;

            const updateData = {
                year,
                course,
                subject
            };

            if (req.file) {
                if (req.file.mimetype !== 'application/pdf') {
                    return res.status(400).json({ error: "Only PDF files are allowed" });
                }
                updateData.fileName = req.file.originalname;
                updateData.fileData = req.file.buffer;
            }

            const updatedPdf = await PdfUpload.findOneAndUpdate(
                { id: parseInt(id) },
                updateData,
                { new: true }
            ).select('-fileData');

            if (!updatedPdf) {
                return res.status(404).json({ error: "PDF not found" });
            }

            res.status(200).json({
                message: "PDF updated successfully",
                pdf: updatedPdf
            });
        } catch (err) {
            console.error("Error updating PDF:", err);
            res.status(500).json({ error: "Failed to update PDF" });
        }
    },

    // Delete PDF
    deletePdfById: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedPdf = await PdfUpload.findOneAndDelete({ id: parseInt(id) });

            if (!deletedPdf) {
                return res.status(404).json({ error: "PDF not found" });
            }

            res.status(200).json({ message: "PDF deleted successfully" });
        } catch (err) {
            console.error("Error deleting PDF:", err);
            res.status(500).json({ error: "Failed to delete PDF" });
        }
    },

    // Download PDF
    downloadPdf: async (req, res) => {
        try {
            const { id } = req.params;
            const pdf = await PdfUpload.findOne({ id: parseInt(id) });

            if (!pdf) {
                return res.status(404).json({ error: "PDF not found" });
            }

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${pdf.fileName}"`,
            });

            res.send(pdf.fileData);
        } catch (err) {
            console.error("Error downloading PDF:", err);
            res.status(500).json({ error: "Failed to download PDF" });
        }
    }
};

module.exports = pdfController;