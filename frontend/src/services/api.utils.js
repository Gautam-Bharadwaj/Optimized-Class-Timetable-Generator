// API utility functions

// Query builder for URL parameters
export const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                value.forEach((item) => searchParams.append(key, String(item)));
            } else {
                searchParams.append(key, String(value));
            }
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
};

// Response transformer
export const transformResponse = (data) => {
    // Handle different response formats
    if (data?.data) {
        return data.data;
    }
    return data;
};

// Pagination helper
export const buildPaginationQuery = (params) => {
    return buildQueryString({
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
    });
};

// Filter helper
export const buildFilterQuery = (filters) => {
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {});

    return buildQueryString(cleanFilters);
};

// File upload helper
export const createFormData = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((item) => {
                if (item instanceof File) {
                    formData.append(key, item);
                } else {
                    formData.append(key, JSON.stringify(item));
                }
            });
        } else if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });

    return formData;
};

// Download helper
export const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

// Debounce helper for search
export const debounce = (
    func,
    wait
) => {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
