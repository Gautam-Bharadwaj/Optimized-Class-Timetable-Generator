import api from '../../services/api';

export const subjectApi = {
    getAll: async () => {
        const response = await api.get('/subjects');
        return response.data.data || [];
    },

    getById: async (id) => {
        const response = await api.get(`/subjects/${id}`);
        return response.data.data;
    },

    getByDepartment: async (departmentId) => {
        const response = await api.get(`/subjects/department/${departmentId}`);
        return response.data.data || [];
    },

    getBySemester: async (semester) => {
        const response = await api.get(`/subjects/semester/${semester}`);
        return response.data.data || [];
    },

    create: async (data) => {
        const response = await api.post('/subjects', data);
        return response.data.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/subjects/${id}`, data);
        return response.data.data;
    },

    delete: async (id) => {
        await api.delete(`/subjects/${id}`);
    },

    getPaginated: async (page = 1, pageSize = 10) => {
        const response = await api.get(
            `/subjects/paginated?page=${page}&pageSize=${pageSize}`
        );
        return response.data.data;
    },
};
