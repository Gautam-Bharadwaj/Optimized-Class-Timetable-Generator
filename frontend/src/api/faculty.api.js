import axiosInstance from './axiosInstance';

export const facultyApi = {
    getAll: async () => {
        const response = await axiosInstance.get('/faculties');
        return response.data;
    },
    getById: async (id) => {
        const response = await axiosInstance.get(`/faculties/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await axiosInstance.post('/faculties', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await axiosInstance.put(`/faculties/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await axiosInstance.delete(`/faculties/${id}`);
        return response.data;
    }
};
