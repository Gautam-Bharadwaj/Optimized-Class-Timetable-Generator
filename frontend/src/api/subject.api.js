import axiosInstance from './axiosInstance';

export const subjectApi = {
    getAll: async () => {
        const response = await axiosInstance.get('/subjects');
        return response.data;
    },
    getById: async (id) => {
        const response = await axiosInstance.get(`/subjects/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await axiosInstance.post('/subjects', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await axiosInstance.put(`/subjects/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await axiosInstance.delete(`/subjects/${id}`);
        return response.data;
    }
};
