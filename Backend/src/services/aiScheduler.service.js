const OpenAI = require("openai");

let client = null;

// Initialize OpenAI client with GitHub Models endpoint
const apiKey = process.env.GITHUB_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const baseURL = "https://models.github.ai/inference";

if (apiKey) {
    client = new OpenAI({
        baseURL: baseURL,
        apiKey: apiKey
    });
    console.log("AI Service initialized with GitHub Models endpoint.");
} else {
    console.warn("AI Service Warning: No API Key found (GITHUB_OPENAI_API_KEY or OPENAI_API_KEY).");
}

const buildPrompt = (data) => {
    return [
        {
            role: "system",
            content: `You are an expert university timetable scheduler. Your task is to generate a conflict-free timetable based on the provided data.
      
      Constraints:
      1. No faculty can be in two places at once.
      2. No classroom can be used by two classes at once.
      3. No student group (semester) can have two classes at once.
      4. Respect faculty availability and max load.
      5. Ensure all subjects get their required number of lectures/labs per week.
      
      Output Format:
      Return ONLY a JSON array of slot objects. Do not include any markdown formatting or explanation.
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
        throw new Error("OpenAI/GitHub API key not configured. Please set GITHUB_OPENAI_API_KEY in your .env file.");
    }

    try {
        console.log("Sending request to GitHub Models...");
        const response = await client.chat.completions.create({
            messages: messages,
            model: "gpt-4o",
            temperature: 0.1,
            max_tokens: 4096,
            top_p: 1
        });

        console.log("Received response from AI.");
        const content = response.choices[0].message.content;

        // Clean up potential markdown code blocks
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanContent);
    } catch (error) {
        console.error("AI Model Call Failed:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        throw new Error(`Failed to generate timetable via AI: ${error.message}`);
    }
};

module.exports = {
    buildPrompt,
    callAiModel
};
