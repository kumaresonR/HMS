import HttpClientWrapper from "../../http-client-wrapper";
import StorageService from "../../storage/storage-service";

class AuthApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    // doLogin = async (payload: any) => {
    //     console.log("AuthApiService doLogin() start = " + JSON.stringify(payload));
    //     try {
    //         if (StorageService.getToken() || StorageService.getToken != null) {
    //             window.localStorage.clear();
    //         }
    //         let response: any = await this.httpClientWrapper.post('/auth/login', payload);
    //         if (response && response.data.token) {
    //             StorageService.setToken(response.data.token);
    //         }
    //         if (response) {
    //             StorageService.saveUserData(response.data);
    //         }
    //         console.log("acces token test");
    //         console.log("AuthApiService doLogin() response data " + JSON.stringify(response));
    //         console.log("AuthApiService doLogin() end = " + JSON.stringify(payload));
    //         return response;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    generatePublicKey = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('login-management-services/api/auth/uniqueId', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    doLogin = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('login-management-services/api/auth/login', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    refreshToken = async (token: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('login-management-services/api/auth/refresh-token?refreshToken='+token,'' );
            return (data);
        } catch (error) {
            throw error;
        }
    }

    doLogout = async () => {
        try {
            let data: any = await this.httpClientWrapper.doLogout('login-management-services/api/auth/logout');
            sessionStorage.clear();
            return (data);
        } catch (error) {
            throw error;
        }
    }

}
export default AuthApiService;