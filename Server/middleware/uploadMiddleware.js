
const multer = require('multer');

const uploadPdf = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
}).single('file');

// Wrapper to handle multer errors
 const uploadMiddleware = (req, res, next) => {
    uploadPdf(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer error occurred
            return res.status(400).json({
                error: err.message,
                code: 'MULTER_ERROR'
            });
        } else if (err) {
            // Unknown error occurred
            return res.status(500).json({
                error: 'File upload failed',
                details: err.message
            });
        }
        // Everything went fine
        next();
    });
}; 

module.exports = uploadMiddleware;