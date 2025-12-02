const prisma = require('../config/prisma');

const getAllDepartments = async () => {
    return await prisma.department.findMany({
        include: {
            _count: {
                select: { faculties: true, classrooms: true, subjects: true }
            }
        }
    });
};

const getDepartmentById = async (id) => {
    return await prisma.department.findUnique({
        where: { id: parseInt(id) },
        include: {
            faculties: true,
            classrooms: true,
            subjects: true
        }
    });
};

const createDepartment = async (data) => {
    return await prisma.department.create({
        data
    });
};

const updateDepartment = async (id, data) => {
    return await prisma.department.update({
        where: { id: parseInt(id) },
        data
    });
};

const deleteDepartment = async (id) => {
    return await prisma.department.delete({
        where: { id: parseInt(id) }
    });
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
