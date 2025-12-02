// Custom API Error types

export class ApiError extends Error {
    constructor(
        message,
        statusCode,
        code,
        details
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = 'ApiError';
    }
}

export class NetworkError extends ApiError {
    constructor(message = 'Network error occurred') {
        super(message, 0, 'NETWORK_ERROR');
        this.name = 'NetworkError';
    }
}

export class AuthenticationError extends ApiError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTH_ERROR');
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends ApiError {
    constructor(message = 'Access denied') {
        super(message, 403, 'AUTHORIZATION_ERROR');
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends ApiError {
    constructor(message = 'Validation failed', details) {
        super(message, 422, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}

export class ServerError extends ApiError {
    constructor(message = 'Server error occurred') {
        super(message, 500, 'SERVER_ERROR');
        this.name = 'ServerError';
    }
}

// Error handler utility
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        const { status, data } = error.response;
        const message = data?.message || data?.error || 'An error occurred';

        switch (status) {
            case 401:
                return new AuthenticationError(message);
            case 403:
                return new AuthorizationError(message);
            case 404:
                return new NotFoundError(message);
            case 422:
                return new ValidationError(message, data?.details);
            case 500:
            case 502:
            case 503:
                return new ServerError(message);
            default:
                return new ApiError(message, status, data?.code, data?.details);
        }
    } else if (error.request) {
        // Request made but no response
        return new NetworkError('No response from server');
    } else {
        // Error in request setup
        return new ApiError(error.message || 'Unknown error occurred');
    }
};

const ENABLE_DEBUG = import.meta.env.VITE_ENABLE_DEBUG === 'true';

// Error notification helper
export const notifyError = (error) => {
    if (ENABLE_DEBUG) {
        console.error('API Error:', {
            name: error.name,
            message: error.message,
            statusCode: error.statusCode,
            code: error.code,
            details: error.details,
        });
    }

    // You can integrate with a toast notification library here
    // toast.error(error.message);
};
