const prisma = require('../config/prisma');

const getGenerationData = async (departmentId, semester) => {
    const deptId = parseInt(departmentId);
    const sem = parseInt(semester);

    // 1. Fetch Department info
    const department = await prisma.department.findUnique({
        where: { id: deptId }
    });

    // 2. Fetch Faculty belonging to this department
    const faculty = await prisma.faculty.findMany({
        where: { departmentId: deptId },
        include: {
            subjects: {
                include: { subject: true }
            }
        }
    });

    // 3. Fetch Subjects for this department and semester
    const subjects = await prisma.subject.findMany({
        where: {
            departmentId: deptId,
            semester: sem
        }
    });

    // 4. Fetch Classrooms for this department
    const classrooms = await prisma.classroom.findMany({
        where: { departmentId: deptId }
    });

    return {
        department,
        semester: sem,
        faculty: faculty.map(f => ({
            id: f.id,
            name: f.name,
            maxWeeklyLoad: f.maxWeeklyLoad,
            availableDays: f.availableDays,
            preferredSlots: f.preferredSlots,
            qualifiedSubjects: f.subjects.map(s => s.subject.code) // List of subject codes they can teach
        })),
        subjects: subjects.map(s => ({
            id: s.id,
            code: s.code,
            name: s.name,
            lecturesPerWeek: s.lecturesPerWeek || 0,
            labsPerWeek: s.labsPerWeek || 0,
            type: s.type,
            durationPerClass: s.durationPerClass || 1
        })),
        classrooms: classrooms.map(c => ({
            id: c.id,
            name: c.name,
            capacity: c.capacity // Assuming capacity field exists or will be added
        })),
        constraints: {
            workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
            slotsPerDay: 8,
            timeSlots: [
                "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
                "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"
            ]
        }
    };
};

const saveGeneratedTimetable = async ({ departmentId, semester, name, generatedById, slots }) => {
    // 1. Create Timetable Header
    const timetable = await prisma.timetable.create({
        data: {
            name,
            generatedById,
            departmentId: parseInt(departmentId),
            semester: parseInt(semester),
            status: 'PENDING',
            scoreJson: "{}" // Placeholder for score
        }
    });

    // 2. Create Slots
    // We need to map the AI output (which might use codes/names) back to IDs if necessary
    // Assuming AI returns valid IDs or we mapped them correctly before calling this.

    const slotData = slots.map(slot => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        subjectId: parseInt(slot.subjectId),
        facultyId: parseInt(slot.facultyId),
        classroomId: parseInt(slot.classroomId),
        semester: parseInt(semester),
        departmentId: parseInt(departmentId),
        timetableId: timetable.id,
        isFixed: false
    }));

    await prisma.timetableSlot.createMany({
        data: slotData
    });

    return await prisma.timetable.findUnique({
        where: { id: timetable.id },
        include: {
            slots: {
                include: {
                    subject: { select: { name: true, code: true } },
                    faculty: { select: { name: true } },
                    classroom: { select: { name: true } }
                }
            }
        }
    });
};

const getTimetableById = async (id) => {
    return await prisma.timetable.findUnique({
        where: { id: parseInt(id) },
        include: {
            slots: {
                include: {
                    subject: { select: { name: true, code: true } },
                    faculty: { select: { name: true } },
                    classroom: { select: { name: true } }
                }
            },
            department: { select: { name: true, code: true } },
            generatedBy: {
                select: { name: true, email: true }
            },
            approvals: {
                include: { approver: { select: { name: true, role: true } } }
            }
        }
    });
};

const getAllTimetables = async (departmentId) => {
    const where = departmentId ? { slots: { some: { departmentId: parseInt(departmentId) } } } : {};

    return await prisma.timetable.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            generatedBy: {
                select: { name: true }
            },
            department: {
                select: { name: true, code: true }
            },
            _count: {
                select: { slots: true }
            }
        }
    });
};

const approveTimetable = async (id, approverId, status, comments) => {
    const timetableId = parseInt(id);

    // 1. Create Approval Record
    await prisma.approval.create({
        data: {
            timetableId,
            approverId,
            status,
            comments
        }
    });

    // 2. Update Timetable Status
    // Logic: If REJECTED, set timetable to REJECTED.
    // If APPROVED, we might want to check if it needs multiple approvals, 
    // but for now, we'll set it to APPROVED directly.

    const newStatus = status === 'REJECTED' ? 'REJECTED' : 'APPROVED';

    return await prisma.timetable.update({
        where: { id: timetableId },
        data: { status: newStatus },
        include: { approvals: true }
    });
};

module.exports = {
    getGenerationData,
    saveGeneratedTimetable,
    getTimetableById,
    getAllTimetables,
    approveTimetable
};
