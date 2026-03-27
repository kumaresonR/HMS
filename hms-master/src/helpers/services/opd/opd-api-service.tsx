import HttpClientWrapper from "../../http-client-wrapper";

class OPDApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllOPD = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('/opd-management-services/opd-admissions/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchOPDBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('/opd-management-services/opd-admissions/opd_patient_search/all?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchOPDDischargeBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('/opd-management-services/opd-admissions/discharge/ipd_patient_search?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getOPDById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd-admissions/combined_details/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getBillingById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('dashboard-management-services/dashboard/opdOrIpd/billing/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getMedicineHistoryById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('dashboard-management-services/dashboard/medical-history/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllVisitsByPatientId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd-admissions/visit_details/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createOPD = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/opd-management-services/opd-admissions/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editOPD = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('opd-management-services/opd-admissions/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteOPD = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('opd-management-services/opd-admissions/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    patientDischarge = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.patchFormData('opd-management-services/opd-admissions/update_discharge/' + id, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Medication 

    getMedicationById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd-medications/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createMedication = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('opd-management-services/opd-medications/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editMedication = async (medicationId: any, dosageId: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('opd-management-services/opd-medications/update/' + medicationId + '/' + dosageId, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteMedication = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('opd-management-services/opd-medications/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // TimeLine

    getAllTimeline = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('/opd-management-services/opd_timelines/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getTimeLineByIpdId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd_timelines/by-ipd/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createTimeline = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('opd-management-services/opd_timelines/add', formData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    editTimeline = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('opd-management-services/opd_timelines/' + id, formData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    deleteTimeLine = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('opd-management-services/opd_timelines/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Nurse Note
    getAllNurseNote = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/ipd_nurse-notes/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getNurseNoteByIpdId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/ipd_nurse-notes/by-ipd/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createNurseNote = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('opd-management-services/ipd_nurse-notes/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createNurseNoteComment = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('opd-management-services/ipd_nurse-notes/' + id + '/comments', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editNurseNote = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('opd-management-services/ipd_nurse-notes/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteNurseNote = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('opd-management-services/ipd_nurse-notes/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Payment
    createPayment = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('opd-management-services/opd-payments/add', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPaymentById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd-payments/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPayment = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('opd-management-services/opd-payments/' + id, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePayment = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('opd-management-services/opd-payments/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Vital
    createVital = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/opd-management-services/opd-vitals/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getVitalById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd-vitals/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editVital = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('/opd-management-services/opd-vitals/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteVital = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('/opd-management-services/opd-vitals/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //ConsultantRegister
    createConsultantRegister = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('opd-management-services/consultant-register/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getConsultantRegisterById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/consultant-register/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editConsultantRegister = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('opd-management-services/consultant-register/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteConsultantRegister = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('opd-management-services/consultant-register/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Operation
    createOperation = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('opd-management-services/opd-operation/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getOperationById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd-operation/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editOperation = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('opd-management-services/opd-operation/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteOperation = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('opd-management-services/opd-operation/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Charges

    createCharges = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('opd-management-services/opd-charges/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllCharges = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd-charges/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editCharges = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('opd-management-services/opd-charges/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteCharges = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('opd-management-services/opd-charges/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllChargetype = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/chargeType/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllChargeCategoryByType = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/ipd-charges-category/type/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllChargeNameByType = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/ipd-charges-name/category/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Prescription 

    getPrescriptionById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd-prescription/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createPrescription = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('opd-management-services/opd-prescription/add', formData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    editPrescription = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('opd-management-services/opd-prescription/update/' + id, formData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    deletePrescription = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('opd-management-services/opd-prescription/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Commission

    createCommission = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('opd-management-services/commission', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllCommission = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/commission');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editCommission = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('opd-management-services/commission/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteCommission = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('opd-management-services/commission/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }
}
export default OPDApiService;