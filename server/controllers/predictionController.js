// server/controllers/predictionController.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Prediction = require('../models/Prediction');
const { generateSuggestion } = require('../services/chatService'); // Ensure correct import
require('dotenv').config();

const ML_API_URL = process.env.ML_API_BASE_URL;

const predictDisease = async (req, res) => {
    const { plantType } = req.params;
    const { landSize } = req.body;
    const validPlantTypes = ['potato', 'tomato', 'pepper'];

    // --- Input Validation ---
    if (!validPlantTypes.includes(plantType)) return res.status(400).json({ message: "Invalid plant type." });
    if (!req.file) return res.status(400).json({ message: "No image file uploaded." });

    const tempFilePath = req.file.path;
    let predictionResult = null; // Keep track of ML result separately
    let suggestion = "Suggestion could not be generated."; // Default fallback

    try {
        // --- 1. Call ML API ---
        const form = new FormData();
        form.append('file', fs.createReadStream(tempFilePath), req.file.originalname);
        const predictUrl = `${ML_API_URL}/predict/${plantType}`;
        console.log(`[CONTROLLER] Calling ML API: ${predictUrl}`);
        const mlResponse = await axios.post(predictUrl, form, { headers: form.getHeaders() });

        predictionResult = mlResponse.data; // Store ML result
        console.log(`[CONTROLLER] ML Response: ${JSON.stringify(predictionResult)}`);

        if (predictionResult.error) {
           throw new Error(`ML API Error: ${predictionResult.error}`);
        }

        // --- 2. Generate Suggestion (only if ML prediction has disease) ---
        if (predictionResult && predictionResult.disease && predictionResult.disease !== 'healthy' /* Optional: skip for healthy */) {
            console.log(`[CONTROLLER] Disease detected (${predictionResult.disease}), attempting suggestion generation...`);
            // generateSuggestion now includes its own try/catch and returns error message on failure
            suggestion = await generateSuggestion(predictionResult, landSize);
            console.log(`[CONTROLLER] Suggestion result from service: "${suggestion.substring(0, 100)}..."`);
        } else if (predictionResult && predictionResult.disease === 'healthy') {
            console.log("[CONTROLLER] Plant is healthy, providing standard healthy suggestion.");
            suggestion = "The plant appears to be healthy! Continue good care practices like proper watering, sunlight, and nutrient management.";
        }
         else {
            console.log("[CONTROLLER] No disease detected or ML error, skipping specific suggestion.");
            suggestion = "No specific disease was confidently identified from the image.";
        }

        // --- 3. (Optional) Save to DB ---
        // (Keep your existing DB save logic here, ensuring 'suggestion' variable is saved)
        if (req.user) {
            try {
                const user = await User.findOne({ firebaseUid: req.user.uid });
                if (user && predictionResult) { // Ensure predictionResult is valid
                    await Prediction.create({
                        user: user._id,
                        plantType: plantType,
                        imageFilename: req.file.filename,
                        disease: predictionResult.disease || 'N/A', // Handle case where disease might be missing
                        confidence: predictionResult.confidence || 0,
                        probabilities: predictionResult.probabilities || {},
                        suggestion: suggestion, // Save the final suggestion (could be error message)
                    });
                     console.log(`[CONTROLLER] Prediction saved for user ${user.email}`);
                }
            } catch (dbError) {
                console.error("[CONTROLLER] Error saving prediction to DB:", dbError);
            }
         }

        // --- 4. Send Combined Response ---
        // Ensure predictionResult is not null before spreading, and always include suggestion
        const responsePayload = {
            ...(predictionResult || {}), // Spread ML results if available
            suggestion: suggestion       // Always include the suggestion string
        };
        console.log("[CONTROLLER] Sending final response payload:", responsePayload);
        res.json(responsePayload);

    } catch (error) {
        console.error('[CONTROLLER] Error in predictDisease controller:', error.response ? error.response.data : error.message);
        // Send back an error response, include the suggestion fallback
        res.status(500).json({
            error: `Error processing prediction: ${error.message}`,
            suggestion: suggestion // Send the default/error suggestion message even on failure
         });
    } finally {
         // Clean up the uploaded file
         fs.unlink(tempFilePath, (err) => {
             if (err) console.error("[CONTROLLER] Error deleting temp upload file:", err);
         });
    }
};

// --- getPredictionHistory (Keep as is) ---
const getPredictionHistory = async (req, res) => { /* ... Your existing code ... */ };

module.exports = { predictDisease, getPredictionHistory };