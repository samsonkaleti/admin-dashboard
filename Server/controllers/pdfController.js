const PdfUpload = require("../models/PdfUpload");
const multer = require("multer");
const fs = require("fs/promises");
const path = require("path");

const pdfController = {
  // Create multiple PDFs

  createPdfs: async (req, res) => {
    try {
      // Check if files exist
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ error: "Please upload at least one PDF file" });
      }
  
      const metadata = JSON.parse(req.body.metadata);
  
      const {
        academicYear: { year, semester },
        regulation,
        course,
        subject,
        units,
      } = metadata;
  
      // Validate required fields
      if (!year || !semester || !regulation || !course || !subject || !units) {
        return res.status(400).json({
          error:
            "Academic year, semester, regulation, course, subject and units are required",
        });
      }
  
      // Validate all files are PDFs
      const invalidFiles = req.files.filter(
        (file) => file.mimetype !== "application/pdf"
      );
      if (invalidFiles.length > 0) {
        return res.status(400).json({
          error: "Only PDF files are allowed",
          invalidFiles: invalidFiles.map((f) => f.originalname),
        });
      }
  
      // Create the uploads directory if it doesn't exist
      const uploadDir = path.join(__dirname, "../uploads");
      await fs.mkdir(uploadDir, { recursive: true });
  
      // Generate unique ID
      const id = Date.now();
  
      // Prepare files array and save files to the uploads folder
      const files = [];
      for (const file of req.files) {
        const filePath = path.join(uploadDir, `${id}_${file.originalname}`);
        await fs.writeFile(filePath, file.buffer);
        files.push({ fileName: file.originalname, filePath });
      }
  
      // Create new PDF document with file paths
      const newPdf = new PdfUpload({
        id,
        academicYear: {
          year,
          semester,
        },
        regulation,
        course,
        subject,
        units,
        files,
      });
  
      await newPdf.save();
  
      res.status(201).json({
        message: "PDFs uploaded successfully",
        pdf: {
          id: newPdf.id,
          academicYear: newPdf.academicYear,
          regulation: newPdf.regulation,
          course: newPdf.course,
          subject: newPdf.subject,
          units: newPdf.units,
          fileNames: newPdf.files.map((f) => f.fileName),
          uploadDate: newPdf.uploadDate,
        },
      });
    } catch (err) {
      console.error("Error uploading PDFs:", err);
      res.status(500).json({ error: "Failed to upload PDFs" });
    }
  },
  

  // Get all PDFs
  getAllPdfs: async (req, res) => {
    try {
      const { year, semester } = req.query;
      let query = {};

      if (year) {
        query["academicYear.year"] = year;
      }
      if (semester) {
        query["academicYear.semester"] = semester;
      }

      const pdfs = await PdfUpload.find(query).select("-files.fileData");
      res.status(200).json(pdfs);
    } catch (err) {
      console.error("Error fetching PDFs:", err);
      res.status(500).json({ error: "Failed to fetch PDFs" });
    }
  },

  // Update PDF document and its files
  updatePdfById: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        "academicYear.year": year,
        "academicYear.semester": semester,
        regulation,
        course,
        subject,
      } = req.body;
      // console.log("pdf upload req.body", req);

      const updateData = {};

      if (year !== undefined) {
        updateData["academicYear.year"] = year;
      }
      if (semester !== undefined) {
        updateData["academicYear.semester"] = semester;
      }
      if (regulation !== undefined) {
        updateData.regulation = regulation;
      }
      if (course !== undefined) {
        updateData.course = course;
      }
      if (subject !== undefined) {
        updateData.subject = subject;
      }

      // Handle file updates if files are provided
      if (req.files && req.files.length > 0) {
        // Validate all files are PDFs
        const invalidFiles = req.files.filter(
          (file) => file.mimetype !== "application/pdf"
        );
        if (invalidFiles.length > 0) {
          return res.status(400).json({
            error: "Only PDF files are allowed",
            invalidFiles: invalidFiles.map((f) => f.originalname),
          });
        }

        // Prepare new files array
        updateData.files = req.files.map((file) => ({
          fileName: file.originalname,
          fileData: file.buffer,
        }));
      }
      console.log("pdf upload id: ", id, JSON.stringify(updateData));
      const updatedPdf = await PdfUpload.findOneAndUpdate({ id }, updateData, {
        new: true,
      }).select("-files.fileData");

      if (!updatedPdf) {
        return res.status(404).json({ error: "PDF document not found" });
      }

      res.status(200).json({
        message: "PDF document updated successfully",
        pdf: updatedPdf,
      });
    } catch (err) {
      console.error("Error updating PDF document:", err);
      res.status(500).json({ error: "Failed to update PDF document" });
    }
  },

  // Delete PDF document
  deletePdfById: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPdf = await PdfUpload.findOneAndDelete({ id: parseInt(id) });

      if (!deletedPdf) {
        return res.status(404).json({ error: "PDF document not found" });
      }

      res.status(200).json({ message: "PDF document deleted successfully" });
    } catch (err) {
      console.error("Error deleting PDF document:", err);
      res.status(500).json({ error: "Failed to delete PDF document" });
    }
  },

  // Download specific PDF file
  downloadPdf: async (req, res) => {
    try {
      const { id, fileIndex } = req.params;
      const pdf = await PdfUpload.findOne({ id: parseInt(id) });

      if (!pdf) {
        return res.status(404).json({ error: "PDF document not found" });
      }

      if (!pdf.files[fileIndex]) {
        return res.status(404).json({ error: "PDF file not found" });
      }

      const file = pdf.files[fileIndex];

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
      });

      res.send(file.fileData);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      res.status(500).json({ error: "Failed to download PDF" });
    }
  },

  // Download all PDFs as ZIP
  downloadAllPdfs: async (req, res) => {
    try {
      const { id } = req.params;
      const pdf = await PdfUpload.findOne({ id: parseInt(id) });

      if (!pdf) {
        return res.status(404).json({ error: "PDF document not found" });
      }

      // Send files as separate downloads for now
      // In a real implementation, you would want to zip the files
      // using a library like 'archiver' and send the zip file
      const fileResponses = pdf.files.map((file) => ({
        fileName: file.fileName,
        contentType: "application/pdf",
        data: file.fileData,
      }));

      res.status(200).json({
        message: "Files ready for download",
        files: fileResponses.map((f) => ({
          fileName: f.fileName,
          size: f.data.length,
        })),
      });
    } catch (err) {
      console.error("Error preparing PDFs for download:", err);
      res.status(500).json({ error: "Failed to prepare PDFs for download" });
    }
  },

  // controllers/pdfController.js

  uploadPdf: async (req, res) => {
    try {
      // Check if files are available
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      // Process each file (e.g., save to database, cloud storage, etc.)
      const uploadedFiles = req.files.map((file) => ({
        originalName: file.originalname,
        size: file.size,
        buffer: file.buffer, // This is only available in memory storage
      }));

      // Simulate saving file data to a database (adjust based on your storage setup)
      // For example, if using cloud storage, replace this with appropriate API calls

      res.status(201).json({
        message: "Files uploaded successfully",
        files: uploadedFiles.map((file) => ({
          name: file.originalName,
          size: file.size,
        })),
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "File upload failed", error: error.message });
    }
  },
};

module.exports = pdfController;
