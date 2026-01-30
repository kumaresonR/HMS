import HttpClientWrapper from "../../http-client-wrapper";

class BillingApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    //Pathology-Radiology Bill

    createPathologyBill = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('/billing-management-services/pathology-bills/generate', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPathologyBill = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pathology-bills' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchPathologyBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pathology-bills/filter?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPathologyBillById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pathology-bills/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPathologyBill = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('/billing-management-services/pathology-bills/update/' + id, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePathologyBill = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('/billing-management-services/pathology-bills/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createBill = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/laboratory-management-services/pathology-tests/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getRadiologyBill = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/radiology-bills' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchRadiologyBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/radiology-bills/filter?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editBill = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('/laboratory-management-services/pathology-tests/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteBill = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('/laboratory-management-services/pathology-tests/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Pathology Test

    createPathologyTest = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/laboratory-management-services/pathology-tests/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPathologyTest = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('laboratory-management-services/pathology-tests/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPathologyTest = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('/laboratory-management-services/pathology-tests/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePathologyTest = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('/laboratory-management-services/pathology-tests/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPathologyByTestId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pathology-bills/test/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }


    //Radiology Test

    createRadiologyTest = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/laboratory-management-services/radiology-tests/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getRadiologyTest = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('laboratory-management-services/radiology-tests/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editRadiologyTest = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('/laboratory-management-services/radiology-tests/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteRadiologyTest = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('/laboratory-management-services/radiology-tests/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createRadiologyBill = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('/billing-management-services/radiology-bills/generate', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getRadiologyBillById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/radiology-bills/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editRadiologyBill = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('/billing-management-services/radiology-bills/update/' + id, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteRadiologyBill = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('/billing-management-services/radiology-bills/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Radiology

    getRadiologyByTestId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/radiology-bills/radiology/test/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createPathologySampleCollection = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/laboratory-management-services/pathology-tests/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPathologySampleCollection = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('/billing-management-services/pathology-bills/update-by-test/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editRadiologySampleCollection = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('/billing-management-services/radiology-bills/radiology/update-by-test/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approvePathologyReport = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('billing-management-services/pathology-bills/test/' + id, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveRadiologyReport = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('billing-management-services/radiology-bills/radiology/' + id, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Pathology Commission

    createPathologyCommission = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('billing-management-services/pathology-commission', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPathologyCommission = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pathology-commission');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPathologyCommission = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('billing-management-services/pathology-commission/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePathologyCommission = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('billing-management-services/pathology-commission/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Radiology Commission

    createRadiologyCommission = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('billing-management-services/radiology-commission', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllRadiologyCommission = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/radiology-commission');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editRadiologyCommission = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('billing-management-services/radiology-commission/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteRadiologyCommission = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('billing-management-services/radiology-commission/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }
}
export default BillingApiService;