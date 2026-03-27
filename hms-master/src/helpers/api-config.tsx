import axios, { AxiosInstance } from "axios";
import store from "../slices/loader/store";
import { showLoader, hideLoader } from "../slices/loader/loaderSlice";

class ApiConfig {

    // private baseURL = 'http://localhost:8099/';
    // private baseURL = 'http://localhost:8087/';
    private baseURL = 'http://localhost:8764/' // Local
    // private baseURL = 'http://192.168.0.60:8764/';
    // private baseURL = 'https://13.233.24.223:8443/'; 
    // private baseURL = 'https://backend.hms.com/' // stage
    

    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = this.baseURL;
    }

    private getApiBaseURL = () => {
        return this.apiBaseUrl;
    }
    public getAxiosInstance = (): AxiosInstance => {
        const api = axios.create({ baseURL: this.getApiBaseURL() });

        // Request Interceptor: Show loader
        api.interceptors.request.use(
            (config) => {
                store.dispatch(showLoader()); 
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
                return Promise.reject(error);
            }
        );

        return api;
    }
}
export default ApiConfig;