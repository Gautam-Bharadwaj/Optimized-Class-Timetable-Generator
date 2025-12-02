// Application constants using environment variables
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Timetable Generator';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const API_URL = import.meta.env.VITE_API_URL || 'https://optimized-class-timetable-generator-ochre.vercel.app/api';
export const API_AUTH_KEY = import.meta.env.VITE_API_AUTH_KEY || '';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

// Feature flags
export const ENABLE_MOCK_API = import.meta.env.VITE_ENABLE_MOCK_API === 'true';
export const ENABLE_DEBUG = import.meta.env.VITE_ENABLE_DEBUG === 'true';

// Storage keys
export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'auth_token';
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token';
export const THEME_KEY = 'theme';

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    DEPARTMENTS: '/dashboard/departments',
    FACULTY: '/dashboard/faculty',
    CLASSROOMS: '/dashboard/classrooms',
    SUBJECTS: '/dashboard/subjects',
    TIMETABLE: '/dashboard/timetable',
    SETTINGS: '/settings',
};
