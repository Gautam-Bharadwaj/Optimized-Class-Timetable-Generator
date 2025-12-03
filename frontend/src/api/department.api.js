import axiosInstance from './axiosInstance';

export const departmentApi = {
    getAll: async () => {
        const response = await axiosInstance.get('/departments');
        return response.data;
    },
    getById: async (id) => {
        const response = await axiosInstance.get(`/departments/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await axiosInstance.post('/departments', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await axiosInstance.put(`/departments/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await axiosInstance.delete(`/departments/${id}`);
        return response.data;
    }
};
