const prisma = require('../config/prisma');

const getAllFaculty = async () => prisma.faculty.findMany({ include: { department: true } });
const getFacultyById = async (id) => prisma.faculty.findUnique({ where: { id: parseInt(id) }, include: { department: true, subjects: true } });
const createFaculty = async (data) => prisma.faculty.create({ data });
const updateFaculty = async (id, data) => prisma.faculty.update({ where: { id: parseInt(id) }, data });
const deleteFaculty = async (id) => prisma.faculty.delete({ where: { id: parseInt(id) } });

module.exports = { getAllFaculty, getFacultyById, createFaculty, updateFaculty, deleteFaculty };
