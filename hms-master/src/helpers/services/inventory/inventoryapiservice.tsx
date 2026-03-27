import HttpClientWrapper from "../../http-client-wrapper";

class InventoryApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllAddItems = async () => {

        try {
            let data: any = await this.httpClientWrapper.get('inventory-management-services/add-item/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAddItemsById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('/inventory-management-services/add-item/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createAddItems = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/inventory-management-services/add-item/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editAddItems = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('/inventory-management-services/add-item/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteAddItems = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('/inventory-management-services/add-item/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Issue Item

    getAllIssueItems = async () => {

        try {
            let data: any = await this.httpClientWrapper.get('/inventory-management-services/add-issue-item/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getIssueItemsById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('/inventory-management-services/add-item/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createIssueItems = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/inventory-management-services/add-issue-item/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editIssueItems = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('/inventory-management-services/add-issue-item/return/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteIssueItems = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('/inventory-management-services/add-issue-item/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Item Stock
    getAllAddItemStock = async () => {

        try {
            let data: any = await this.httpClientWrapper.get('inventory-management-services/item-stock/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAddItemStockById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('/inventory-management-services/item-stock/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createAddItemStock = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('/inventory-management-services/item-stock/create', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editAddItemStock = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('/inventory-management-services/item-stock/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteAddItemStock = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('/inventory-management-services/item-stock/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }
}
export default InventoryApiService;