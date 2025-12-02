import api from '../../services/api';

export const facultyApi = {
    getAll: async () => {
        const response = await api.get('/faculty');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/faculty/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/faculty', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/faculty/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/faculty/${id}`);
        return response.data;
    }
};
