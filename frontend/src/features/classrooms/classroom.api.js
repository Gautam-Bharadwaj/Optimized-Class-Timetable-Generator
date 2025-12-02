import api from '../../services/api';

export const classroomApi = {
    getAll: async () => {
        const response = await api.get('/classrooms');
        return response.data.data || [];
    },

    getById: async (id) => {
        const response = await api.get(`/classrooms/${id}`);
        return response.data.data;
    },

    getByDepartment: async (departmentId) => {
        const response = await api.get(`/classrooms/department/${departmentId}`);
        return response.data.data || [];
    },

    create: async (data) => {
        const response = await api.post('/classrooms', data);
        return response.data.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/classrooms/${id}`, data);
        return response.data.data;
    },

    delete: async (id) => {
        await api.delete(`/classrooms/${id}`);
    },

    getPaginated: async (page = 1, pageSize = 10) => {
        const response = await api.get(
            `/classrooms/paginated?page=${page}&pageSize=${pageSize}`
        );
        return response.data.data;
    },
};
