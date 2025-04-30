const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
        index: true,
    },
    plantType: {
        type: String,
        required: true,
        enum: ['potato', 'tomato', 'pepper'], // Ensure valid types
    },
    imageFilename: { // Store filename if you save uploads, or maybe a reference
        type: String,
    },
    disease: {
        type: String,
        required: true,
    },
    confidence: {
        type: Number,
        required: true,
    },
    probabilities: {
        type: Map, // Or Mixed, depending on how you store it
        of: Number
    },
    suggestion: { // Store generated suggestion
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Prediction', predictionSchema);