const OpenAI = require("openai");

let client = null;

// Only initialize OpenAI client if API key is provided
if (process.env.GITHUB_OPENAI_API_KEY || process.env.OPENAI_API_KEY) {
    client = new OpenAI({
        baseURL: process.env.GITHUB_OPENAI_API_KEY ? "https://models.github.ai/inference" : undefined,
        apiKey: process.env.GITHUB_OPENAI_API_KEY || process.env.OPENAI_API_KEY
    });
}

const buildPrompt = (data) => {
    return [
        {
            role: "system",
            content: `You are a university timetable generator.
      
      CONSTANTS:
      - All slots are EXACTLY 1 hour (e.g., 09:00-10:00).
      - Working hours: 09:00 to 17:00.
      
      CRITICAL RULES:
      1. Assign lectures as requested.
      2. No overlaps for Faculty, Room, or Student Group.
      3. Use EXACT IDs provided.

      Output Format:
      JSON Array of objects: 
      [{"dayOfWeek": "MONDAY", "startTime": "09:00", "endTime": "10:00", "subjectId": 1, "facultyId": 1, "classroomId": 1}]
      
      Return ONLY valid JSON. No text.`
        },
        {
            role: "user",
            content: `Data: ${JSON.stringify(data)}`
        }
    ];
};

const callAiModel = async (messages) => {
    if (!client) {
        throw new Error("OpenAI API key not configured. Please set GITHUB_OPENAI_API_KEY or OPENAI_API_KEY in your .env file.");
    }

    try {
        const response = await client.chat.completions.create({
            messages: messages,
            model: "gpt-4o-mini",
            temperature: 0.1,
            max_tokens: 4096,
            top_p: 1
        });

        const content = response.choices[0].message.content;

        // Clean up potential markdown code blocks
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

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
