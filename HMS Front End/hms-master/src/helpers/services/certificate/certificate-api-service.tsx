import HttpClientWrapper from "../../http-client-wrapper";

class CertificateApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllCertificateTemplate = async () => {

        try {
            let data: any = await this.httpClientWrapper.get('download-management-services/certificate/getAllCertificateTemplates');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getCertificateTemplateById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('download-management-services/certificate/getCertificateTemplate/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createCertificateTemplate = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('download-management-services/certificate/saveTemplate', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editCertificateTemplate = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('/download-management-services/certificate/updateCertificateTemplate', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteCertificateTemplate = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('/download-management-services/certificate/deleteCertificateTemplate/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPatientIdTemplate = async () => {

        try {
            let data: any = await this.httpClientWrapper.get('download-management-services/idCard/getAllPatientIdCardTemplates');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPatientIdTemplateById = async (id:any) => {

        try {
            let data: any = await this.httpClientWrapper.get('download-management-services/idCard/getPatientIdCardTemplate/'+id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createPatientIdTemplate = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('download-management-services/idCard/saveTemplate', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPatientIdTemplate = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('download-management-services/idCard/updateStaffIdCardTemplate', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePatientIdTemplate = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('download-management-services/idCard/deletePatientIdCardTemplate/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllStaffIdTemplate = async () => {

        try {
            let data: any = await this.httpClientWrapper.get('download-management-services/idCard/getAllStaffIdCardTemplates');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    geStaffIdTemplateById = async (id:any) => {

        try {
            let data: any = await this.httpClientWrapper.get('download-management-services/idCard/getStaffIdCardTemplate/'+id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createStaffIdTemplate = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('download-management-services/idCard/saveStaffTemplate', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editStaffIdTemplate = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('download-management-services/idCard/updateStaffIdCardTemplate', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteStaffIdTemplate = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('download-management-services/idCard/deleteStaffIdCardTemplate/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }
}
export default CertificateApiService;