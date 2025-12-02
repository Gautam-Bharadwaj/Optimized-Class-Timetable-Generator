const facultyService = require('../services/faculty.service');

const getFaculties = async (req, res, next) => {
    try { res.json(await facultyService.getAllFaculty()); } catch (e) { next(e); }
};
const getFaculty = async (req, res, next) => {
    try { res.json(await facultyService.getFacultyById(req.params.id)); } catch (e) { next(e); }
};
const createFaculty = async (req, res, next) => {
    try { res.status(201).json(await facultyService.createFaculty(req.body)); } catch (e) { next(e); }
};
const updateFaculty = async (req, res, next) => {
    try { res.json(await facultyService.updateFaculty(req.params.id, req.body)); } catch (e) { next(e); }
};
const deleteFaculty = async (req, res, next) => {
    try { await facultyService.deleteFaculty(req.params.id); res.status(204).send(); } catch (e) { next(e); }
};

module.exports = { getFaculties, getFaculty, createFaculty, updateFaculty, deleteFaculty };
