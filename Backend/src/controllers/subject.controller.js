const subjectService = require('../services/subject.service');

const getSubjects = async (req, res, next) => {
    try { res.json(await subjectService.getAllSubjects()); } catch (e) { next(e); }
};
const getSubject = async (req, res, next) => {
    try { res.json(await subjectService.getSubjectById(req.params.id)); } catch (e) { next(e); }
};
const createSubject = async (req, res, next) => {
    try { res.status(201).json(await subjectService.createSubject(req.body)); } catch (e) { next(e); }
};
const updateSubject = async (req, res, next) => {
    try { res.json(await subjectService.updateSubject(req.params.id, req.body)); } catch (e) { next(e); }
};
const deleteSubject = async (req, res, next) => {
    try { await subjectService.deleteSubject(req.params.id); res.status(204).send(); } catch (e) { next(e); }
};

module.exports = { getSubjects, getSubject, createSubject, updateSubject, deleteSubject };
