// Shared types and interfaces for the timetable system

export const Role = {
    SUPERADMIN: 'SUPERADMIN',
    TIMETABLE_ADMIN: 'TIMETABLE_ADMIN',
    HOD: 'HOD',
    FACULTY: 'FACULTY',
    VIEWER: 'VIEWER',
};

export const TimetableStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
};

export const ApprovalStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
};

export const SubjectType = {
    LECTURE: 'LECTURE',
    LAB: 'LAB',
    TUTORIAL: 'TUTORIAL',
};

export const ClassroomType = {
    LECTURE: 'LECTURE',
    LAB: 'LAB',
    TUTORIAL: 'TUTORIAL',
};

export const DayOfWeek = {
    MONDAY: 'MONDAY',
    TUESDAY: 'TUESDAY',
    WEDNESDAY: 'WEDNESDAY',
    THURSDAY: 'THURSDAY',
    FRIDAY: 'FRIDAY',
    SATURDAY: 'SATURDAY',
};
