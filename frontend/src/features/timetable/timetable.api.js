import api from '../../services/api';

export const timetableApi = {
    generate: async (data) => {
        const response = await api.post('/timetables/generate', data);
        return response.data;
    },
    getAll: async (departmentId) => {
        const response = await api.get('/timetables', { params: { departmentId } });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/timetables/${id}`);
        return response.data;
    },
    approve: async (id, status, comments) => {
        const response = await api.post(`/timetables/${id}/approve`, { status, comments });
        return response.data;
    }
};
