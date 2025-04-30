// server/services/chatService.js
const Groq = require('groq-sdk');
require('dotenv').config();
const { getCurrentWeather, getForecastWeather } = require('./weatherService'); // Assuming history isn't essential for suggestion

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- Refined getGroqChatCompletion ---
const getGroqChatCompletion = async (userMessage, systemPromptContext = "") => {
    // Combine fixed system prompt with dynamic context
    const systemPrompt = `You are AgriBot, a helpful assistant specializing in Indian agriculture, crop diseases, and farming practices. Be concise and helpful. Current location context is Nagpur, India. ${systemPromptContext}\nAnswer the user's query based on this context and your general knowledge.`;

    console.log(`[GROQ SVC] Sending prompt (start): ${systemPrompt.substring(0,150)}...`); // Log start of prompt

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            model: "llama3-8b-8192", // Or your preferred model
            temperature: 0.7,
            max_tokens: 500, // Adjust token limit as needed for suggestions
            top_p: 1,
        });

        const content = chatCompletion.choices[0]?.message?.content;
        if (content) {
             console.log(`[GROQ SVC] Received valid response from Groq.`);
             return content;
        } else {
             console.warn("[GROQ SVC] Groq response was successful but content was empty.");
             // Consider returning a specific message or throwing an error
             // depending on how you want to handle empty AI responses
             return "AgriBot received an empty response from the AI model.";
        }

    } catch (error) {
        console.error("[GROQ SVC] Groq API call failed:", error);
        // Re-throw a more specific error for the caller to handle
        throw new Error(`AgriBot AI service failed: ${error.message}`);
    }
};

// --- Refined generateSuggestion ---
const generateSuggestion = async (predictionResult, landSize = null) => {
    console.log(`[SUGGESTION SVC] Attempting to generate suggestion for disease: ${predictionResult?.disease}`);
    if (!predictionResult?.disease) {
        console.log("[SUGGESTION SVC] Cannot generate suggestion: Disease information missing.");
        return "No disease was identified, so no specific suggestion can be provided.";
    }

    let weatherContextString = "Weather data is currently unavailable."; // Default weather info
    try {
        // Fetch relevant weather data - keep it concise
        const current = await getCurrentWeather();
        const forecast = await getForecastWeather(2); // Maybe just next 2 days forecast
        weatherContextString = `Current weather: Temp ${current.temp_c}°C, Humidity ${current.humidity}%, Precip ${current.precip_mm}mm. Forecast (approx): similar conditions expected next 2 days unless precipitation is mentioned.`;
        // Simplify forecast representation for the prompt if needed
        console.log("[SUGGESTION SVC] Weather data fetched successfully.");
    } catch (weatherError) {
        console.error("[SUGGESTION SVC] Failed to fetch weather data for suggestion:", weatherError.message);
        // Proceed without weather data, using the default string
    }

    // Construct the prompt for Groq (acting as the 'user message' to the refined getGroqChatCompletion)
    const userQueryForSuggestion = `My ${predictionResult.plantType} plant was diagnosed with '${predictionResult.disease}' (confidence: ${Math.round(predictionResult.confidence * 100)}%). ${landSize ? `I have ${landSize} acres.` : ''} Provide concise, actionable management/treatment suggestions suitable for Indian conditions, considering the current weather context. Focus on practical steps.`;

    // Pass weather info as part of the system prompt context
    const systemContext = `Weather Context: ${weatherContextString}`;

    try {
        // Call the refined Groq function
        const suggestion = await getGroqChatCompletion(userQueryForSuggestion, systemContext);
        console.log("[SUGGESTION SVC] Suggestion received successfully from Groq service.");
        return suggestion; // Return the suggestion text
    } catch (groqError) {
        console.error("[SUGGESTION SVC] Failed to get suggestion from Groq service:", groqError.message);
        // Return a user-friendly error message
        return `AgriBot could not generate suggestions due to an internal error (${groqError.message}). Please try again later or consult the chat section.`;
    }
};


module.exports = { getGroqChatCompletion, generateSuggestion };