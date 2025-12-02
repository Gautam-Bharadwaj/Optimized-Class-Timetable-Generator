const departmentService = require('../services/department.service');

const getDepartments = async (req, res, next) => {
    try {
        const departments = await departmentService.getAllDepartments();
        res.json(departments);
    } catch (error) {
        next(error);
    }
};

const getDepartment = async (req, res, next) => {
    try {
        const department = await departmentService.getDepartmentById(req.params.id);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.json(department);
    } catch (error) {
        next(error);
    }
};

const createDepartment = async (req, res, next) => {
    try {
        const department = await departmentService.createDepartment(req.body);
        res.status(201).json(department);
    } catch (error) {
        next(error);
    }
};

const updateDepartment = async (req, res, next) => {
    try {
        const department = await departmentService.updateDepartment(req.params.id, req.body);
        res.json(department);
    } catch (error) {
        next(error);
    }
};

const deleteDepartment = async (req, res, next) => {
    try {
        await departmentService.deleteDepartment(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
