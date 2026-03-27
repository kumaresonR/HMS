import HttpClientWrapper from "../../http-client-wrapper";

class TpaApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllTpa = async () => {

        try {
            let data: any = await this.httpClientWrapper.get('tpa-management-services/tpa-details/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    gettpaById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('tpa-management-services/tpa-details/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createtpaRecord = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('/tpa-management-services/tpa-details/add', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editTpa = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('tpa-management-services/tpa-details/' + id, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteTpa = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('tpa-management-services/tpa-details/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllTpaForIpd = async () => {

        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-admissions/all/ipd-details');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllTpaForOpd = async () => {

        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd-admissions/all/opd-details');
            return (data);
        } catch (error) {
            throw error;
        }
    }
}
export default TpaApiService;