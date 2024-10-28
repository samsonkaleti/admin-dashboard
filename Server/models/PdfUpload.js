const mongoose = require("mongoose");

const PdfUploadSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    year: {
        type: String,
        required: true,
        enum: ['2022', '2023', '2024'] // Match frontend options
    },
    course: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileData: {
        type: Buffer,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

const PdfUpload = mongoose.model("PdfUpload", PdfUploadSchema);
module.exports = PdfUpload;