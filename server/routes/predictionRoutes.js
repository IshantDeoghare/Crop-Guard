const express = require('express');
const multer = require('multer');
const path = require('path');
const { predictDisease, getPredictionHistory } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware'); // Protect routes
const fs = require('fs'); 
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'uploads'); // Store in server/uploads/
        // Ensure the directory exists
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Create a unique filename
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// POST /api/predict/:plantType (e.g., /api/predict/tomato)
router.post('/:plantType', protect, upload.single('file'), predictDisease);

// GET /api/predict/history
router.get('/history', protect, getPredictionHistory);


module.exports = router;