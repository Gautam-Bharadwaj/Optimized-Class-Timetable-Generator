import api from '../../services/api';

export const timetableApi = {
    generate: async (data) => {
        const response = await api.post('/timetable/generate', data);
        return response.data;
    },
    getAll: async (departmentId) => {
        const response = await api.get('/timetable', { params: { departmentId } });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/timetable/${id}`);
        return response.data;
    },
    approve: async (id, status, comments) => {
        const response = await api.post(`/timetable/${id}/approve`, { status, comments });
        return response.data;
    }
};
