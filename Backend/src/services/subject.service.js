const prisma = require('../config/prisma');

const getAllSubjects = async () => prisma.subject.findMany({ include: { department: true } });
const getSubjectById = async (id) => prisma.subject.findUnique({ where: { id: parseInt(id) }, include: { department: true } });
const createSubject = async (data) => prisma.subject.create({ data });
const updateSubject = async (id, data) => prisma.subject.update({ where: { id: parseInt(id) }, data });
const deleteSubject = async (id) => {
    const subjectId = parseInt(id);
    return await prisma.$transaction([
        // 1. Delete Faculty Assignments
        prisma.subjectFaculty.deleteMany({ where: { subjectId } }),
        // 2. Delete Timetable Slots using this subject
        prisma.timetableSlot.deleteMany({ where: { subjectId } }),
        // 3. Delete the Subject itself
        prisma.subject.delete({ where: { id: subjectId } })
    ]);
};

module.exports = { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject };
