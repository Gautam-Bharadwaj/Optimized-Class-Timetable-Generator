const prisma = require('../config/prisma');

const getAllSubjects = async () => prisma.subject.findMany({ include: { department: true } });
const getSubjectById = async (id) => prisma.subject.findUnique({ where: { id: parseInt(id) }, include: { department: true } });
const createSubject = async (data) => prisma.subject.create({ data });
const updateSubject = async (id, data) => prisma.subject.update({ where: { id: parseInt(id) }, data });
const deleteSubject = async (id) => prisma.subject.delete({ where: { id: parseInt(id) } });

module.exports = { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject };
