import HttpClientWrapper from "../../http-client-wrapper";

class PatientApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllPatient = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('patient-management-services/patients/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchPatient = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.postBy('patient-management-services/patients/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPatientById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('patient-management-services/patients/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createPatient = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('patient-management-services/patients/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPatient = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('patient-management-services/patients/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    uploadOldPrescription = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.patchFormData('patient-management-services/patients/old-prescription/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePatient = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('patient-management-services/patients/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getInsuranceData = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('patient-management-services/insurance-providers/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchOpdOrIpdByPatientId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-admissions/active-ipdOrOpd/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPatientByIpdOrOpdId = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-admissions/death-patient/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllAntenatalPatientByIpdOrOpdId = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-admissions/antenatal-patient/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }
}
export default PatientApiService;