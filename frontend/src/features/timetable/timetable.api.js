import api from '../../services/api';

export const timetableApi = {
    generate: async (data) => {
        const response = await api.post('/timetables/generate', data);
        return response.data.data || [];
    },

    getById: async (id) => {
        const response = await api.get(`/timetables/${id}`);
        return response.data.data;
    },

    getByDepartment: async (departmentId) => {
        const response = await api.get(`/timetables/department/${departmentId}`);
        return response.data.data || [];
    },

    approve: async (data) => {
        const response = await api.post('/timetables/approve', data);
        return response.data.data;
    },

    reject: async (timetableId, comments) => {
        await api.post('/timetables/reject', { timetableId, comments });
    },

    export: async (timetableId, format) => {
        const response = await api.get(`/timetables/${timetableId}/export?format=${format}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    getSlots: async (timetableId) => {
        const response = await api.get(`/timetables/${timetableId}/slots`);
        return response.data.data || [];
    },

    delete: async (id) => {
        await api.delete(`/timetables/${id}`);
    },
};
