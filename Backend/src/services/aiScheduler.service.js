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
            content: `You are an expert university timetable scheduler. Your task is to generate a conflict-free timetable based on the provided data.
      
      CRITICAL CONSTRAINTS:
      1. No faculty can be in two places at once.
      2. No classroom can be used by two classes at once.
      3. No student group (the requested semester) can have two classes at once.
      4. Respect faculty availability and max load.
      5. EXACT COUNTS: If a subject says it needs 3 lectures, you MUST provide exactly 3 slots. No more, no less.
      6. DATA CONSISTENCY: Use the exact IDs provided for faculty, subjects, and classrooms.
      
      Output Format:
      Return ONLY a JSON array of slot objects. Do not include any markdown formatting or explanation. 
      The output should be a single valid JSON array.
      
      Example Object:
      {
        "dayOfWeek": "MONDAY",
        "startTime": "09:00",
        "endTime": "10:00",
        "subjectId": 101,
        "facultyId": 5,
        "classroomId": 10
      }`
        },
        {
            role: "user",
            content: `Generate a timetable for the following data: ${JSON.stringify(data)}`
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
