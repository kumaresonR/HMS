import axios, { AxiosInstance } from "axios";
import store from "../slices/loader/store";
import { showLoader, hideLoader } from "../slices/loader/loaderSlice";

class ApiConfig {

    // Get API URL from environment variable or use default
    private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8764';
    
    // Legacy URLs (commented out - use environment variables instead)
    // private baseURL = 'http://localhost:8099/';
    // private baseURL = 'http://localhost:8087/';
    // private baseURL = 'http://192.168.0.60:8764/';
    // private baseURL = 'https://13.233.24.223:8443/'; 
    // private baseURL = 'https://backend.hmshms.com/' // stage
    

    private apiBaseUrl: string;

    constructor() {
        // Ensure baseURL ends with / for proper API calls
        this.apiBaseUrl = this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`;
        
        // Log API URL in development mode
        if (process.env.NODE_ENV === 'development') {
            console.log('API Base URL:', this.apiBaseUrl);
        }
    }

    private getApiBaseURL = () => {
        return this.apiBaseUrl;
    }
    public getAxiosInstance = (): AxiosInstance => {
        const api = axios.create({ 
            baseURL: this.getApiBaseURL(),
            timeout: 30000, // 30 seconds timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Request Interceptor: Show loader and add auth token
        api.interceptors.request.use(
            (config) => {
                store.dispatch(showLoader());
                
                // Add authorization token if available
                const userData: string | null = sessionStorage.getItem('userData');
                if (userData && config.headers) {
                    try {
                        const parsedUserData = JSON.parse(userData);
                        const token = parsedUserData.access_token;
                        if (token) {
                            config.headers.Authorization = `Bearer ${token}`;
                        }
                    } catch (e) {
                        // Invalid userData, continue without token
                    }
                }
                
                return config;
            },
            (error) => {
                store.dispatch(hideLoader());
                return Promise.reject(error);
            }
        );

        // Response Interceptor: Hide loader
        api.interceptors.response.use(
            (response) => {
                store.dispatch(hideLoader());
                return response;
            },
            (error) => {
                store.dispatch(hideLoader());
                // Handle timeout errors
                if (error.code === 'ECONNABORTED' || error.message === 'timeout of 30000ms exceeded') {
                    console.error('Request timeout: The server took too long to respond');
                } else if (error.response) {
                    // Server responded with error status
                    console.error('API Error:', error.response.status, error.response.data);
                } else if (error.request) {
                    // Request was made but no response received
                    console.error('Network Error: No response from server. Please check if the API Gateway is running.');
                }
                return Promise.reject(error);
            }
        );

        return api;
    }
}
export default ApiConfig;