const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
    console.error("ERROR: GOOGLE_AI_API_KEY environment variable is missing.");
    process.exit(1);
}

async function testGemini() {
    console.log("1. Initializing Gemini Client...");
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Testing the newly configured Flash Preview model
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 2. Define Dummy Data
    const dummyData = {
        department: "Computer Science",
        semester: 3,
        subjects: [
            { id: 101, name: "Data Structures", code: "CS301", lectures: 2, facultyId: 501 },
            { id: 102, name: "Database Systems", code: "CS302", lectures: 2, facultyId: 502 }
        ],
        faculty: [
            { id: 501, name: "Dr. Ada Lovelace" },
            { id: 502, name: "Dr. Grace Hopper" }
        ],
        classrooms: [
            { id: 201, name: "Room 303", capacity: 60 }
        ]
    };

    // 3. Construct Prompt (Same logic as in service)
    const systemInstruction = `You are a university timetable scheduler.
    CRITICAL RULES:
    1. No overlaps.
    2. EXACT COUNTS: Subject 101 needs 2 slots. Subject 102 needs 2 slots.
    3. Use provided IDs exactly.
    
    Output Format: ONLY a valid JSON array of objects. No text.
    Example: [{"dayOfWeek": "MONDAY", "startTime": "09:00", "endTime": "10:00", "subjectId": 101, "facultyId": 501, "classroomId": 201}]`;

    const userMessage = `Generate timetable for: ${JSON.stringify(dummyData)}`;
    const fullPrompt = `${systemInstruction}\n\n${userMessage}`;

    console.log("2. Sending Prompt to Gemini...");
    try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        console.log("\n--- Raw AI Response START ---");
        console.log(text);
        console.log("--- Raw AI Response END ---\n");

        // Clean and Parse
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedContext = JSON.parse(cleanJson);

        console.log("3. SUCCESS! Parsed JSON Output:");
        console.dir(parsedContext, { depth: null, colors: true });

        // Basic Validation
        const slotCount = parsedContext.length;
        console.log(`\n✅ Generated ${slotCount} slots. (Expected 4)`);

    } catch (error) {
        console.error("\n❌ Error Calling Gemini:", error);
        if (error.response) {
            console.error("Error Details:", error.response);
        }
    }
}

testGemini();
