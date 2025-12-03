import axios from 'axios';
import { API_URL, API_TIMEOUT, TOKEN_KEY, ENABLE_DEBUG, API_AUTH_KEY } from '../utils/constants';
import { handleApiError, notifyError } from './api.errors';

// Create axios instance with configuration
console.log('Initializing API with URL:', API_URL);
const api = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'apiauthkey': API_AUTH_KEY
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem(TOKEN_KEY);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in debug mode
        if (ENABLE_DEBUG) {
            console.log('API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
            });
        }

        return config;
    },
    (error) => {
        if (ENABLE_DEBUG) {
            console.error('Request Error:', error);
        }
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Log response in debug mode
        if (ENABLE_DEBUG) {
            console.log('API Response:', {
                status: response.status,
                url: response.config.url,
                data: response.data,
            });
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { token } = response.data.data;
                    localStorage.setItem(TOKEN_KEY, token);

                    // Retry original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        const apiError = handleApiError(error);
        notifyError(apiError);

        return Promise.reject(apiError);
    }
);

// Retry logic for network errors
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const retryRequest = async (
    requestFn,
    retries = MAX_RETRIES
) => {
    try {
        return await requestFn();
    } catch (error) {
        if (retries > 0 && error.name === 'NetworkError') {
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            return retryRequest(requestFn, retries - 1);
        }
        throw error;
    }
};

export default api;
