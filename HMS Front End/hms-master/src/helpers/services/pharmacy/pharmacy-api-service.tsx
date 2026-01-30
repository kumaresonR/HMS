import axios from "axios";
import HttpClientWrapper from "../../http-client-wrapper";

class PharmacyApiService {

    getLowMovingMedicines = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pharmacy-bill/lowSoldMedicine');
            return (data);
        } catch (error) {
            throw error;
        }
    }
    getFastMovingMedicineCompanies = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pharmacy-bill/highSoldMedicineCompany');
            return (data);
        } catch (error) {
            throw error;
        }
    }
    getLowMovingMedicineCompanies = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pharmacy-bill/lowSoldMedicineCompany');
            return (data);
        } catch (error) {
            throw error;
        }
    }
    getNotSaleMedicines = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pharmacy-bill/notSaleMedicineCompany');
            return (data);
        } catch (error) {
            throw error;
        }
    }
    getNotSaleMedicineCompanies = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pharmacy-bill/notSaleMedicineCompany');
            return (data);
        } catch (error) {
            throw error;
        }
    }
    getFastMovingMedicines = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pharmacy-bill/highSoldMedicine');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllPharmacyBill = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pharmacy-bill' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchPharmacyBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pharmacy-bill/filter?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createPharmacyBill = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('billing-management-services/pharmacy-bill/generate', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPharmacyBill = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('billing-management-services/pharmacy-bill/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePharmacyBill = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('billing-management-services/pharmacy-bill/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMedicineStock = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/add-medicine/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }


    uploadedMedicines = async (formData: any) => {
        try {
            const aiApiUrl = process.env.REACT_APP_AI_API_URL || 'https://ai.api.hms.com/api';
            const data: any = await axios.post(
                `${aiApiUrl}/upload/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    aiSuggestMedicines = async (formData: any) => {
        try {
            const aiApiUrl = process.env.REACT_APP_AI_API_URL || 'https://ai.api.hms.com/api';
            const data: any = await axios.post(
                `${aiApiUrl}/medicine/similar/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    searchMedinceName = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/add-medicine/search?medicineName=' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllLowStockMedicine = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/add-medicine/low-boxPacking');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createMedicineStock = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('billing-management-services/add-medicine/create', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    editMedicineStock = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('billing-management-services/add-medicine/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteMedicineStock = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('billing-management-services/add-medicine/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPurchaseMedicine = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/purchase-medicine' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPurchaseMedicineById = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/purchase-medicine/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createPurchaseMedicine = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('billing-management-services/purchase-medicine/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPurchaseMedicine = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('billing-management-services/purchase-medicine/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllSupplier = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/suppliers/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePurchase = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('billing-management-services/purchase-medicine/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    moveToMedicineStock = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('billing-management-services/purchase-medicine/' + id + '/status?status=COMPLETED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Bad Stock
    createBadStock = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('billing-management-services/bad-stock/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllBadStockByMedicineId = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/bad-stock/medicine/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllBadStock = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/bad-stock/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteBadStock = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('billing-management-services/bad-stock/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Get Pharmacy Details By Prescription 
    getAllPharmacyByOpdPrescription = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd-prescription/prescriptionNo/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPharmacyByIpdPrescription = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-prescription/prescriptionNo/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPrescriptionByIpdId = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opd-admissions/getprescription/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPrescriptionByOpdId = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-admissions/getprescription/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Pharmacy Commission

    createPharmacyCommission = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('billing-management-services/pharmacy-commission', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPharmacyCommission = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pharmacy-commission');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPharmacyCommission = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('billing-management-services/pharmacy-commission/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePharmacyCommission = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('billing-management-services/pharmacy-commission/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }
}
export default PharmacyApiService;