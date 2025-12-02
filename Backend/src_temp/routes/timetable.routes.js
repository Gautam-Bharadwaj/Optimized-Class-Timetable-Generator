const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetable.controller');
const authApiKey = require('../middleware/authApiKey');
const { verifyToken } = require('../middleware/authJwt');

router.use(authApiKey);
router.use(verifyToken); // Protect all timetable routes with JWT

router.post('/generate', timetableController.generateTimetable);
router.get('/', timetableController.getTimetables);
router.get('/:id', timetableController.getTimetable);
router.post('/:id/approve', timetableController.approveTimetable);

module.exports = router;
