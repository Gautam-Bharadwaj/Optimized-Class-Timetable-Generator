// Mock API responses for development and testing

import { ENABLE_MOCK_API } from '../utils/constants';
import { Department } from '../features/departments/department.types';
import { Faculty } from '../features/faculty/faculty.types';
import { Classroom } from '../features/classrooms/classroom.types';
import { Subject } from '../features/subjects/subject.types';

// Mock data
export const mockDepartments = [
    {
        id: 1,
        name: 'Computer Science & Engineering',
        code: 'CSE',
        headOfDepartment: 'Dr. John Doe',
        totalFaculty: 12,
        totalStudents: 240,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 2,
        name: 'Electronics & Communication',
        code: 'ECE',
        headOfDepartment: 'Dr. Jane Smith',
        totalFaculty: 10,
        totalStudents: 200,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const mockFaculty = [
    {
        id: 1,
        name: 'Dr. Alice Brown',
        email: 'alice@college.edu',
        phone: '+91 9876543210',
        departmentId: 1,
        maxWeeklyLoad: 18,
        averageLeavesPerMonth: 1,
        availableDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        preferredSlots: ['09:00-10:00', '10:00-11:00'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const mockClassrooms = [
    {
        id: 1,
        name: 'CSE-Lab-1',
        capacity: 60,
        type: 'LAB',
        departmentId: 1,
        year: 2,
        semester: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const mockSubjects = [
    {
        id: 1,
        code: 'CS101',
        name: 'Data Structures',
        departmentId: 1,
        credits: 4,
        type: 'LECTURE',
        lecturesPerWeek: 3,
        labsPerWeek: 1,
        semester: 3,
        durationPerClass: 60,
        allowedRoomTypes: ['LECTURE', 'LAB'],
        prerequisites: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Mock API delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API wrapper
export const mockApiCall = async (data, shouldFail = false) => {
    if (!ENABLE_MOCK_API) {
        throw new Error('Mock API is disabled');
    }

    await delay();

    if (shouldFail) {
        throw new Error('Mock API error');
    }

    return data;
};

// Mock CRUD operations
export const mockCrud = {
    getAll: async (data) => {
        return mockApiCall(data);
    },

    getById: async (data, id) => {
        const item = data.find((item) => item.id === id);
        return mockApiCall(item);
    },

    create: async (data, newItem) => {
        const id = Math.max(...data.map((item) => item.id || 0), 0) + 1;
        const created = { ...newItem, id };
        return mockApiCall(created);
    },

    update: async (
        data,
        id,
        updates
    ) => {
        const item = data.find((item) => item.id === id);
        if (item) {
            const updated = { ...item, ...updates };
            return mockApiCall(updated);
        }
        return undefined;
    },

    delete: async (_data, _id) => {
        await mockApiCall(null);
    },
};
