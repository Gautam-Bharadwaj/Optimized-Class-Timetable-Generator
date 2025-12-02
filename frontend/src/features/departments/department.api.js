import api from '../../services/api';

export const departmentApi = {
    getAll: async () => {
        const response = await api.get('/departments');
        return response.data.data || [];
    },

    getById: async (id) => {
        const response = await api.get(`/departments/${id}`);
        return response.data.data;
    },

    create: async (data) => {
        const response = await api.post('/departments', data);
        return response.data.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/departments/${id}`, data);
        return response.data.data;
    },

    delete: async (id) => {
        await api.delete(`/departments/${id}`);
    },

    getPaginated: async (page = 1, pageSize = 10) => {
        const response = await api.get(
            `/departments/paginated?page=${page}&pageSize=${pageSize}`
        );
        return response.data.data;
    },
};
