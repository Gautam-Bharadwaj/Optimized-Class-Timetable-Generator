const prisma = require('../config/prisma');

const getAllClassrooms = async () => prisma.classroom.findMany({ include: { department: true } });
const getClassroomById = async (id) => prisma.classroom.findUnique({ where: { id: parseInt(id) }, include: { department: true } });
const createClassroom = async (data) => prisma.classroom.create({ data });
const updateClassroom = async (id, data) => prisma.classroom.update({ where: { id: parseInt(id) }, data });
const deleteClassroom = async (id) => prisma.classroom.delete({ where: { id: parseInt(id) } });

module.exports = { getAllClassrooms, getClassroomById, createClassroom, updateClassroom, deleteClassroom };
