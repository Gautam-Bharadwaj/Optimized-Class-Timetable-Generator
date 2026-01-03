const timetableService = require('../services/timetable.service');
const aiSchedulerService = require('../services/aiScheduler.service');
const validateTimetable = require('../utils/timetableValidator');

const generateTimetable = async (req, res, next) => {
    try {
        const { departmentId, semester, name } = req.body;
        const generatedById = req.user.id; // From authJwt

        // 1. Get Data
        const data = await timetableService.getGenerationData(departmentId, semester);

        // 2. Build Prompt & Call AI
        const messages = aiSchedulerService.buildPrompt(data);
        const generatedSlots = await aiSchedulerService.callAiModel(messages);

        // 3. Validate
        const validation = validateTimetable(generatedSlots);
        if (!validation.valid) {
            return res.status(400).json({
                error: "AI generated an invalid timetable",
                details: validation.errors,
                rawOutput: generatedSlots
            });
        }

        // 4. Save
        const savedTimetable = await timetableService.saveGeneratedTimetable({
            departmentId,
            semester,
            name: name || `Timetable - ${new Date().toISOString()}`,
            generatedById,
            slots: generatedSlots
        });

        res.status(201).json(savedTimetable);

    } catch (error) {
        console.error("AI Generation Failed, attempting fallback:", error.message);

        // --- Fallback Mechanism ---
        try {
            // Re-fetch data if needed or just use 'data' from above if scope allows. 
            // We need to move 'data' variable declaration up or re-fetch.
            const data = await timetableService.getGenerationData(req.body.departmentId, req.body.semester);

            const fallbackSlots = [];
            const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
            const times = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

            let dayIdx = 0;
            let timeIdx = 0;

            // Simple round-robin assignment
            data.subjects.forEach(subject => {
                const totalSlots = (subject.lectures || 0) + (subject.labs || 0);
                for (let i = 0; i < totalSlots; i++) {
                    if (timeIdx >= times.length) {
                        timeIdx = 0;
                        dayIdx = (dayIdx + 1) % days.length;
                    }

                    fallbackSlots.push({
                        dayOfWeek: days[dayIdx],
                        startTime: times[timeIdx],
                        endTime: times[timeIdx] === "12:00" ? "13:00" :
                            parseInt(times[timeIdx]) + 1 + ":00", // Simple increment
                        subjectId: subject.id,
                        facultyId: subject.facultyId || (data.faculty[0] ? data.faculty[0].id : null),
                        classroomId: data.classrooms[0] ? data.classrooms[0].id : null
                    });

                    timeIdx++;
                }
            });

            const savedTimetable = await timetableService.saveGeneratedTimetable({
                departmentId: req.body.departmentId,
                semester: req.body.semester,
                name: req.body.name || `Fallback Timetable - ${new Date().toISOString()}`,
                generatedById: req.user.id,
                slots: fallbackSlots
            });

            return res.status(201).json({
                ...savedTimetable,
                warning: "Generated using fallback scheduler due to AI unavailability."
            });

        } catch (fallbackError) {
            console.error("Fallback generation failed:", fallbackError);
            next(error); // Return original error if fallback also fails
        }
    }
};

const getTimetable = async (req, res, next) => {
    try {
        const timetable = await timetableService.getTimetableById(req.params.id);
        if (!timetable) {
            return res.status(404).json({ error: "Timetable not found" });
        }
        res.json(timetable);
    } catch (error) {
        next(error);
    }
};

const getTimetables = async (req, res, next) => {
    try {
        const { departmentId } = req.query;
        const timetables = await timetableService.getAllTimetables(departmentId);
        res.json(timetables);
    } catch (error) {
        next(error);
    }
};

const approveTimetable = async (req, res, next) => {
    try {
        const { status, comments } = req.body; // status: 'APPROVED' | 'REJECTED'
        const approverId = req.user.id;
        const { role } = req.user;

        // Role Check: Only HOD, TIMETABLE_ADMIN, or SUPERADMIN can approve
        if (!['HOD', 'TIMETABLE_ADMIN', 'SUPERADMIN', 'FACULTY'].includes(role)) {
            return res.status(403).json({ error: "Insufficient permissions to approve timetables" });
        }

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: "Invalid status. Must be APPROVED or REJECTED" });
        }

        const result = await timetableService.approveTimetable(req.params.id, approverId, status, comments);
        res.json(result);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateTimetable,
    getTimetable,
    getTimetables,
    approveTimetable
};
