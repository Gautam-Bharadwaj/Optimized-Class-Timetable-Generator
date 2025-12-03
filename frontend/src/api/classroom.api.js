import axiosInstance from './axiosInstance';

export const classroomApi = {
    getAll: async () => {
        const response = await axiosInstance.get('/classrooms');
        return response.data;
    },
    getById: async (id) => {
        const response = await axiosInstance.get(`/classrooms/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await axiosInstance.post('/classrooms', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await axiosInstance.put(`/classrooms/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await axiosInstance.delete(`/classrooms/${id}`);
        return response.data;
    }
};
