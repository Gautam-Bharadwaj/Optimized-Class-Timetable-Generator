// API utility functions

// Query builder for URL parameters
export const buildQueryString = (params: Record<string, any>): string => {
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
export const transformResponse = <T>(data: any): T => {
    // Handle different response formats
    if (data?.data) {
        return data.data as T;
    }
    return data as T;
};

// Pagination helper
export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const buildPaginationQuery = (params: PaginationParams): string => {
    return buildQueryString({
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
    });
};

// Filter helper
export const buildFilterQuery = (filters: Record<string, any>): string => {
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, any>);

    return buildQueryString(cleanFilters);
};

// File upload helper
export const createFormData = (data: Record<string, any>): FormData => {
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
export const downloadFile = (blob: Blob, filename: string) => {
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
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
