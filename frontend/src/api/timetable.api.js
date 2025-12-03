import axiosInstance from './axiosInstance';

export const timetableApi = {
    getAll: async () => {
        const response = await axiosInstance.get('/timetables');
        return response.data;
    },
    getById: async (id) => {
        const response = await axiosInstance.get(`/timetables/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await axiosInstance.post('/timetables', data);
        return response.data;
    },
    generate: async (config) => {
        const response = await axiosInstance.post('/timetables/generate', config);
        return response.data;
    },
    approve: async (id, status, comments) => {
        const response = await axiosInstance.post(`/timetables/${id}/approve`, { status, comments });
        return response.data;
    },
    delete: async (id) => {
        const response = await axiosInstance.delete(`/timetables/${id}`);
        return response.data;
    }
};
