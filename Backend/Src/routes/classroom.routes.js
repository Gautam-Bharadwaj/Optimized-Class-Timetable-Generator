const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroom.controller');
const authApiKey = require('../middleware/authApiKey');

router.use(authApiKey);

router.get('/', classroomController.getClassrooms);
router.get('/:id', classroomController.getClassroom);
router.post('/', classroomController.createClassroom);
router.put('/:id', classroomController.updateClassroom);
router.delete('/:id', classroomController.deleteClassroom);

module.exports = router;
