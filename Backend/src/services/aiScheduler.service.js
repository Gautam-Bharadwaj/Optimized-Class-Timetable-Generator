const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

// Initialize Google Gemini Client
// We use a hardcoded fallback or environment variable
const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyC1BPy6YsEDLp60d_-FnR3h82kiEnaYGyg";
if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" }); // Using the specific preview model
}

const buildPrompt = (data) => {
    // Gemini prompt structure is simpler (just a string usually, but we keep the logic clean)
    const systemInstruction = `You are an expert university timetable scheduler. Your task is to generate a conflict-free timetable based on the provided data.
      
      CRITICAL CONSTRAINTS:
      1. No faculty can be in two places at once.
      2. No classroom can be used by two classes at once.
      3. No student group (the requested semester) can have two classes at once.
      4. Respect faculty availability and max load.
      5. EXACT COUNTS: If a subject says it needs 3 lectures, you MUST provide exactly 3 slots. No more, no less.
      6. DATA CONSISTENCY: Use the exact IDs provided for faculty, subjects, and classrooms.
      
      Output Format:
      Return ONLY a JSON array of slot objects. Do not include any markdown formatting (like \`\`\`json) or explanation. 
      The output should be a single valid JSON array.
      
      Example Object:
      {
        "dayOfWeek": "MONDAY",
        "startTime": "09:00",
        "endTime": "10:00",
        "subjectId": 101,
        "facultyId": 5,
        "classroomId": 10
      }`;

    const userMessage = `Generate a timetable for the following data: ${JSON.stringify(data)}`;

    return `${systemInstruction}\n\n${userMessage}`;
};

const callAiModel = async (prompt) => {
    if (!model) {
        throw new Error("Google Gemini API key not configured.");
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if Gemini adds it
        const cleanContent = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanContent);
    } catch (error) {
        console.error("AI Model Call Failed:", error);
        throw new Error("Failed to generate timetable via AI");
    }
};

module.exports = {
    buildPrompt,
    callAiModel
};
