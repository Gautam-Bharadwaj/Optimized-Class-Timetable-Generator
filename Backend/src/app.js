const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authApiKey = require('./middleware/authApiKey');

const app = express();

app.use(express.json());

// Configure CORS to allow frontend origin
app.use(cors({
    origin: true, // Allow any origin that sends a request
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'apiauthkey']
}));

// Global API Key Middleware (can be applied globally or per route)
// app.use(authApiKey); 

app.get('/', (req, res) => {
    res.send('Timetable Generator API is running');
});

// Routes will be imported here
const departmentRoutes = require('./routes/department.routes');
const authRoutes = require('./routes/auth.routes');
const timetableRoutes = require('./routes/timetable.routes');
const facultyRoutes = require('./routes/faculty.routes');
const subjectRoutes = require('./routes/subject.routes');
const classroomRoutes = require('./routes/classroom.routes');

app.use('/api/departments', departmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/classrooms', classroomRoutes);

app.use(errorHandler);

module.exports = app;
