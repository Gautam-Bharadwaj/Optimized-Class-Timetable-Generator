// Mock API responses for development and testing

import { ENABLE_MOCK_API } from '../utils/constants';
import { Department } from '../features/departments/department.types';
import { Faculty } from '../features/faculty/faculty.types';
import { Classroom } from '../features/classrooms/classroom.types';
import { Subject } from '../features/subjects/subject.types';

// Mock data
export const mockDepartments: Department[] = [
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

export const mockFaculty: Faculty[] = [
    {
        id: 1,
        name: 'Dr. Alice Brown',
        email: 'alice@college.edu',
        phone: '+91 9876543210',
        departmentId: 1,
        maxWeeklyLoad: 18,
        averageLeavesPerMonth: 1,
        availableDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] as any,
        preferredSlots: ['09:00-10:00', '10:00-11:00'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const mockClassrooms: Classroom[] = [
    {
        id: 1,
        name: 'CSE-Lab-1',
        capacity: 60,
        type: 'LAB' as any,
        departmentId: 1,
        year: 2,
        semester: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const mockSubjects: Subject[] = [
    {
        id: 1,
        code: 'CS101',
        name: 'Data Structures',
        departmentId: 1,
        credits: 4,
        type: 'LECTURE' as any,
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
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API wrapper
export const mockApiCall = async <T>(data: T, shouldFail: boolean = false): Promise<T> => {
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
    getAll: async <T>(data: T[]): Promise<T[]> => {
        return mockApiCall(data);
    },

    getById: async <T>(data: T[], id: number): Promise<T | undefined> => {
        const item = data.find((item: any) => item.id === id);
        return mockApiCall(item as T);
    },

    create: async <T extends { id?: number }>(data: T[], newItem: Omit<T, 'id'>): Promise<T> => {
        const id = Math.max(...data.map((item: any) => item.id || 0), 0) + 1;
        const created = { ...newItem, id } as T;
        return mockApiCall(created);
    },

    update: async <T extends { id: number }>(
        data: T[],
        id: number,
        updates: Partial<T>
    ): Promise<T | undefined> => {
        const item = data.find((item) => item.id === id);
        if (item) {
            const updated = { ...item, ...updates };
            return mockApiCall(updated);
        }
        return undefined;
    },

    delete: async (_data: any[], _id: number): Promise<void> => {
        await mockApiCall(null);
    },
};
