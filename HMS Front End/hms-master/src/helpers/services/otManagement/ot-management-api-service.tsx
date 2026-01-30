import HttpClientWrapper from "../../http-client-wrapper";

class OTManagementApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllOperation = async (url:any) => {

        try {
            let data: any = await this.httpClientWrapper.get('ot-management-services/operation/'+url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    updateOperation = async (url: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('ot-management-services/operation/' + url, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    updateStatus = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('/ot-management-services/operation/'+url);
            return (data);
        } catch (error) {
            throw error;
        }
    }
}
export default OTManagementApiService;