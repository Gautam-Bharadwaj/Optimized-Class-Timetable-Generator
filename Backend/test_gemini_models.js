const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyC1BPy6YsEDLp60d_-FnR3h82kiEnaYGyg";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    console.log("Listing available models...");
    try {
        // Unfortunately the SDK doesn't expose listModels directly in some versions, 
        // but we can try a known older model 'gemini-1.0-pro' just in case.
        // Or we can try to guess based on standard list.

        // Let's try 'gemini-1.0-pro' which is the base stable model.
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.0-pro: ", await result.response.text());
        return;
    } catch (e) {
        console.log("gemini-1.0-pro failed.");
    }

    try {
        // Try the one you suggested just in case it's a private preview key
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash: ", await result.response.text());
    } catch (e) {
        console.log("gemini-1.5-flash failed: " + e.message);
    }
}

listModels();
