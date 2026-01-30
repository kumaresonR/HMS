import { AxiosError } from "axios";
import { toast } from "react-toastify";

const ErrorHandler = (error: AxiosError) => {
    if (error.response) {
        const status = error.response.status;
        const data: any = error.response.data;
        
        // Handle different HTTP status codes
        switch (status) {
            case 400:
                // Bad Request
                if (data && typeof data === 'object') {
                    const errorMessage = data.message || data.error || 'Invalid request. Please check your input.';
                    toast.error(errorMessage, { containerId: 'TR' });
                } else if (data) {
                    toast.error(data, { containerId: 'TR' });
                } else {
                    toast.error('Invalid request. Please check your input.', { containerId: 'TR' });
                }
                break;
            case 401:
                // Unauthorized - Token refresh should handle this, but show message if refresh fails
                if (data && typeof data === 'object') {
                    const errorMessage = data.message || data.error || 'Session expired. Please login again.';
                    toast.error(errorMessage, { containerId: 'TR' });
                } else {
                    toast.error('Session expired. Please login again.', { containerId: 'TR' });
                }
                break;
            case 403:
                // Forbidden
                toast.error('You do not have permission to perform this action.', { containerId: 'TR' });
                break;
            case 404:
                // Not Found
                toast.error('The requested resource was not found.', { containerId: 'TR' });
                break;
            case 500:
            case 502:
            case 503:
                // Server Errors
                toast.error('Server error. Please try again later.', { containerId: 'TR' });
                break;
            default:
                // Other errors
                if (data && typeof data === 'object') {
                    const errorMessage = data.message || data.error || 'An unexpected error occurred.';
                    toast.error(errorMessage, { containerId: 'TR' });
                } else if (data) {
                    toast.error(data, { containerId: 'TR' });
                } else {
                    toast.error('An unexpected server error occurred.', { containerId: 'TR' });
                }
        }
    } else if (error.request) {
        // Network error - no response received
        if (error.code === 'ECONNABORTED') {
            toast.error('Request timeout. Please check your connection and try again.', { containerId: 'TR' });
        } else {
            toast.error('Network error. Please check your internet connection.', { containerId: 'TR' });
        }
    } else {
        // Request setup error
        toast.error(error.message || 'An error occurred. Please try again.', { containerId: 'TR' });
    }
}

export default ErrorHandler
