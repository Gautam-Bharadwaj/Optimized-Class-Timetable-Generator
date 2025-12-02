import api from '../../services/api';

export const authApi = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    // Logout is handled client-side by removing token
    logout: async () => {
        // Optional: Call backend if you implement a blacklist
        return Promise.resolve();
    },
    // Optional: Implement /auth/me in backend if needed
    getCurrentUser: async () => {
        // const response = await api.get('/auth/me');
        // return response.data;
        return Promise.resolve(null);
    },
};
