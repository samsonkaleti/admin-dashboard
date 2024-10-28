const mongoose = require("mongoose");

const PdfUploadSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileData: {
        type: Buffer, // Store the binary data of the PDF
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

const PdfUpload = mongoose.model("PdfUpload", PdfUploadSchema);

module.exports = PdfUpload;
