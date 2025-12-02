const classroomService = require('../services/classroom.service');

const getClassrooms = async (req, res, next) => {
    try { res.json(await classroomService.getAllClassrooms()); } catch (e) { next(e); }
};
const getClassroom = async (req, res, next) => {
    try { res.json(await classroomService.getClassroomById(req.params.id)); } catch (e) { next(e); }
};
const createClassroom = async (req, res, next) => {
    try { res.status(201).json(await classroomService.createClassroom(req.body)); } catch (e) { next(e); }
};
const updateClassroom = async (req, res, next) => {
    try { res.json(await classroomService.updateClassroom(req.params.id, req.body)); } catch (e) { next(e); }
};
const deleteClassroom = async (req, res, next) => {
    try { await classroomService.deleteClassroom(req.params.id); res.status(204).send(); } catch (e) { next(e); }
};

module.exports = { getClassrooms, getClassroom, createClassroom, updateClassroom, deleteClassroom };
