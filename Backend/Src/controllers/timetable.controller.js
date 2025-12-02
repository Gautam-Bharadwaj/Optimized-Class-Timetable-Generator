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
        next(error);
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
        if (!['HOD', 'TIMETABLE_ADMIN', 'SUPERADMIN'].includes(role)) {
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
