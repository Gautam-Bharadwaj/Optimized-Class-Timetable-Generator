import api from '../../services/api';

export const classroomApi = {
    getAll: async () => {
        const response = await api.get('/classrooms');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/classrooms/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/classrooms', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/classrooms/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/classrooms/${id}`);
        return response.data;
    }
};
