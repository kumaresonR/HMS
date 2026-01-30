import HttpClientWrapper from "../../http-client-wrapper";

class IPDApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllIPD = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-admissions/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchIPDBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-admissions/ipd_patient_search/all?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchIPDDischargeBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-admissions/discharge/ipd_patient_search?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getIPDById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-admissions/combined_details/' + id);
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

    createIPD = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/ipd-admissions/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editIPD = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/ipd-admissions/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteIPD = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd-admissions/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // BedGroup 

    getBedData = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-room/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createBedGroupDetails = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/ipd-room/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getBedGroupById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-room/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editBedGroup = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/ipd-room/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteBedGroup = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd-room/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Medication 

    getMedicationById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-medications/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createMedication = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/ipd-medications/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editMedication = async (medicationId: any, dosageId: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/ipd-medications/update/' + medicationId + '/' + dosageId, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteMedication = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd-medications/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // TimeLine

    getAllTimeline = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd_timelines/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getTimeLineByIpdId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd_timelines/by-ipd/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createTimeline = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('ipd-management-services/ipd_timelines/add', formData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    editTimeline = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('ipd-management-services/ipd_timelines/' + id, formData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    deleteTimeLine = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd_timelines/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Nurse Note
    getAllNurseNote = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd_nurse-notes/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getNurseNoteByIpdId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd_nurse-notes/by-ipd/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createNurseNote = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/ipd_nurse-notes/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createNurseNoteComment = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/ipd_nurse-notes/' + id + '/comments', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editNurseNote = async (id: any, commentsId: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/ipd_nurse-notes/update/' + id + '/' + commentsId, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteNurseNote = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd_nurse-notes/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteNurseNoteCommment = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd_nurse-notes/comments/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    //Payment
    createPayment = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('ipd-management-services/ipd-payments/add', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPaymentById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-payments/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPayment = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('ipd-management-services/ipd-payments/' + id, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePayment = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd-payments/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Vital
    createVital = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/ipd-vitals/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getVitalById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-vitals/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editVital = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/ipd-vitals/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteVital = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd-vitals/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //ConsultantRegister
    createConsultantRegister = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/consultant-register/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getConsultantRegisterById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/consultant-register/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editConsultantRegister = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/consultant-register/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteConsultantRegister = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/consultant-register/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Operation
    createOperation = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/ipd-operation/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getOperationById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-operation/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editOperation = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/ipd-operation/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteOperation = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd-operation/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Charges

    createCharges = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/ipd-charges/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllCharges = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-charges/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editCharges = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/ipd-charges/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteCharges = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd-charges/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllChargetype = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/chargeType/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllChargeCategoryByType = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-charges-category/type/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllChargeNameByType = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-charges-name/category/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Discharge

    patientDischarge = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.patchFormData('ipd-management-services/ipd-admissions/update_discharge/' + id, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Prescription 

    getPrescriptionById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-prescription/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createPrescription = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('ipd-management-services/ipd-prescription/add', formData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    editPrescription = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('ipd-management-services/ipd-prescription/update/' + id, formData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    deletePrescription = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd-prescription/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Previous Obstetric History

    createPreviousObstetricHistory = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/ipd-obstetric/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPreviousObstetricHistoryById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-obstetric/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPreviousObstetricHistory = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/ipd-obstetric/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePreviousObstetricHistory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd-obstetric/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Postnatal History

    createPostnatalHistory = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/ipd_postnatal_history/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPostnatalHistoryById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd_postnatal_history/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPostnatalHistory = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/ipd_postnatal_history/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePostnatalHistory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/ipd_postnatal_history/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Antenatal

    createAntenatal = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/antenatal-finding/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAntenatalById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/antenatal-finding/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editAntenatal = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/antenatal-finding/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteAntenatal = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/antenatal-finding/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Commission

    createCommission = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ipd-management-services/commission', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllCommission = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/commission');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editCommission = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('ipd-management-services/commission/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteCommission = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('ipd-management-services/commission/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }
}
export default IPDApiService;