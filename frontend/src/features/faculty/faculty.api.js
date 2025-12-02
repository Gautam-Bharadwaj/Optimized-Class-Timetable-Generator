import api from '../../services/api';

export const facultyApi = {
    getAll: async () => {
        const response = await api.get('/faculty');
        return response.data.data || [];
    },

    getById: async (id) => {
        const response = await api.get(`/faculty/${id}`);
        return response.data.data;
    },

    getByDepartment: async (departmentId) => {
        const response = await api.get(`/faculty/department/${departmentId}`);
        return response.data.data || [];
    },

    create: async (data) => {
        const response = await api.post('/faculty', data);
        return response.data.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/faculty/${id}`, data);
        return response.data.data;
    },

    delete: async (id) => {
        await api.delete(`/faculty/${id}`);
    },

    getPaginated: async (page = 1, pageSize = 10) => {
        const response = await api.get(
            `/faculty/paginated?page=${page}&pageSize=${pageSize}`
        );
        return response.data.data;
    },
};
