import HttpClientWrapper from "../../http-client-wrapper";

class SetupApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    // Pharmacy

    // Medicine Category

    getAllMedicineCategory = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/medicine-categories/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMedicineCategoryWorkTable = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/medicine-categories/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createMedicineCategory = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/medicine-categories/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveMedicineCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/medicine-categories/approve/' + id,);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveMedicineCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/medicine-categories/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editMedicineCategory = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/medicine-categories/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteMedicineCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/medicine-categories/tw/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Medicine Dosage

    getAllMedicineDosage = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/medicine-dosages/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMedicineDosageTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/medicine-dosages/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createMedicineDosage = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/medicine-dosages/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveMedicineDosage = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/medicine-dosages/approve/' + id,);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveMedicineDosage = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/medicine-dosages/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editMedicineDosage = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/medicine-dosages/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteMedicineDosage = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/medicine-dosages/tw/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Medicine Company

    getAllMedicineCompany = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/companies/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMedicineCompanyTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/companies/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createMedicineCompany = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/companies/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveMedicineCompany = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/companies/approve/' + id,);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveMedicineCompany = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/companies/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editMedicineCompany = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/companies/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteMedicineCompany = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/companies/tw/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Dose Intervel

    getAllDoseIntervel = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/dose-intervals/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllDoseIntervelTW = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/dose-intervals/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createDoseIntervel = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/dose-intervals/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveDoseIntervel = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/dose-intervals/approve/' + id,);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveDoseIntervel = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/dose-intervals/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editDoseIntervel = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/dose-intervals/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteDoseIntervel = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/dose-intervals/tw/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Dose Duration

    getAllDoseDuration = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/dose-durations/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllDoseDurationTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/dose-durations/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createDoseDuration = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/dose-durations/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveDoseDuration = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/dose-durations/approve/' + id,);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveDoseDuration = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/dose-durations/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editDoseDuration = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/dose-durations/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteDoseDuration = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/dose-durations/tw/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Unit

    getAllUnit = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/units/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllUnitTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/units/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createUnit = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/units/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveUnit = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/units/approve/' + id,);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveUnit = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/units/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editUnit = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/units/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteUnit = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/units/tw/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Medicine Group

    getAllMedicineGroup = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/medicine-groups/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMedicineGroupTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/medicine-groups/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createMedicineGroup = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/medicine-groups/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveMedicineGroup = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/medicine-groups/approve/' + id,);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveMedicineGroup = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/medicine-groups/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editMedicineGroup = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/medicine-groups/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteMedicineGroup = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/medicine-groups/tw/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Supplier

    getAllSupplier = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/suppliers/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllSupplierTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/suppliers/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createSupplier = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/suppliers/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveSupplier = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/suppliers/approve/' + id,);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveSupplier = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/suppliers/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editSupplier = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/suppliers/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteSupplier = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/suppliers/tw/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Charge Category

    getAllChargeCategory = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/charges/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createChargeCategory = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/dose-durations/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveChargeCategory = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/dose-durations/approve/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteChargeCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/dose-durations/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Finance

    getAllIncomeHeads = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/income-heads/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllIncomeHeadsTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/income-heads/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createIncomeHeads = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/income-heads/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveIncomeHeads = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/income-heads/approve/' + id,);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveIncomeHeads = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/income-heads/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editIncomeHeads = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/income-heads/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteIncomeHeads = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/income-heads/tw/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllExpenseHeads = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/expenses-head/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllExpenseHeadsTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/expenses-head/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createExpenseHeads = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/expenses-head/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveExpenseHeads = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/expenses-head/approve/' + id,);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveExpenseHeads = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/expenses-head/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editExpenseHeads = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/expenses-head/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteExpenseHeads = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/expenses-head/tw/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Inventory

    getAllInventoryCategory = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/item-categories/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllInventoryCategoryTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/item-categories/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createInventoryCategory = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/item-categories/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveInventoryCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/item-categories/approve/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveInventoryCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/item-categories/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editInventoryCategory = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('/admin-management-services/item-categories/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteInventoryCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/item-categories/tw/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Floor 

    getAllFloor = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/floor/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMasterFloor = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/floor/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createFloor = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/floor/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveFloor = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/floor/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editFloor = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/floor/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteFloor = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/floor/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Bed group

    getAllBedGroup = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/bed-group/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMasterBedGroup = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/bed-group/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllRommByBedGroupId = async (id:any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/bed-details/room_number/'+id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createBedGroup = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/bed-group/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveBedGroup = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/bed-group/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editBedGroup = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/bed-group/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteBedGroup = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/bed-group/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Bed Type

    getAllBedType = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('/admin-management-services/bed-type/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMasterBedType = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/bed-type/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createBedType = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/admin-management-services/bed-type/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveBedType = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/bed-type/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editBedType = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/bed-type/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteBedType = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/bed-type/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Bed

    getAllBed = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/bed-details/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMasterBed = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/bed-details/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createBed = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/bed-details/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveBed = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/bed-details/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editBed = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/bed-details/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteBed = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/bed-details/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllEmployee = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/employees/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getEmployeeById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/employees/tw/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveEmployee = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/employees/approve/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveEmployee = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/employees/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteEmployee = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/employees/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Item Supplier

    getAllItemSupplier = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/item-suppliers/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllItemSupplierTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/item-suppliers/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createItemSupplier = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/item-suppliers/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveItemSupplier = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/item-suppliers/approve/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveItemSupplier = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/item-suppliers/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editItemSupplier = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/item-suppliers/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteItemSupplier = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/item-suppliers/tw/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Item Store

    getAllItemStore = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('/admin-management-services/item-stores/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllItemStoreTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('/admin-management-services/item-stores/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createItemStore = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/item-stores/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveItemStore = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/item-stores/approve/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveItemStore = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/item-stores/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editItemStore = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/item-stores/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteItemStore = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/item-stores/tw/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Raiology Category

    //Category
    getAllRaiologyCategory = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/Add-radiologies/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllRaiologyCategoryTm = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/Add-radiologies/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createRaiologyCategory = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/Add-radiologies/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveRaiologyCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/Add-radiologies/approve/' + id, '');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveRaiologyCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/Add-radiologies/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editRaiologyCategory = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/Add-radiologies/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteRaiologyCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/Add-radiologies/tw/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllRaiologyUnit = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/radiology-units/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllRaiologyUnitWorkTable = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/radiology-units/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createRaiologyUnit = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/radiology-units/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveRaiologyUnit = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/radiology-units/approve/' + id,);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveRaiologyUnit = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/radiology-units/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editRaiologyunit = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/radiology-units/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteRaiologyUnit = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/radiology-units/tw/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllRaiologyParameter = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/radiology-parameter/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllRaiologyParameterTm = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/radiology-parameter/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createRaiologyParameter = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/radiology-parameter/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveRaiologyParameter = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/radiology-parameter/approve/' + id, '');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveRaiologyParameterr = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/radiology-parameter/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editRaiologyParameter = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/radiology-parameter/tw/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteRaiologyParameter = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/radiology-parameter/tw/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Blood Bank
    getAllProduct = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/products/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMasterProduct = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/products/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createProduct = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/products/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveProduct = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/products/approve/' + id, '');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveProduct = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/products/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editProduct = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/products/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteProduct = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/products/tw/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Pathology 

    //Category
    getAllPathologyCategory = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/Add-pathologies/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPathologyCategoryMaster = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/Add-pathologies/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createPathologyCategory = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/Add-pathologies/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approvePathologyCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/Add-pathologies/approve/' + id, '');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApprovePathologyCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/Add-pathologies/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPathologyCategory = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/Add-pathologies/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePathologyCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/Add-pathologies/tw/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPathologyUnit = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/pathology-units/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPathologyUnitWorkTable = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/pathology-units/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createPathologyUnit = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/pathology-units/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approvePathologyUnit = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/pathology-units/approve/' + id, '');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApprovePathologyUnit = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/pathology-units/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPathalogyUnit = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/pathology-units/tw/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePathologyUnit = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/pathology-units/tw/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPathologyParameter = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/pathology-parameter/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPathologyParameterTM = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/pathology-parameter/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createPathologyParameter = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/pathology-parameter/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approvePathologyParameter = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/pathology-parameter/approve/' + id, '');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApprovePathologyParameter = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/pathology-parameter/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPathologyParameter = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/pathology-parameter/' + id + '/update', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePathologyParameter = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/pathology-parameter/tw/' + id + '/delete');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Hr

    //Department
    getAllDepartment = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/department/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllDepartmentMaster = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/department/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createDepartment = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/department/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveDepartment = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/department/approve/' + id, '');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveDepartment = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/department/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editDepartment = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/department/tw/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteDepartment = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/department/tw/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Leave type
    getAllLeaveType = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/leave-type/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllLeaveTypeMaster = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/leave-type/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createLeaveType = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/leave-type/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveLeaveType = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/leave-type/approve/' + id, '');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveLeaveType = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/leave-type/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editLeaveType = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/leave-type/tw/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteLeaveType = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/leave-type/tw/' + id + '/delete');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //designation

    getAllDesignation = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/designation/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllDesignationMaster = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/designation/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createDesignation = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/designation/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveDesignation = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/designation/approve/' + id, '');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveDesignation = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/designation/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editDesignation = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/designation/tw/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteDesignation = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/designation/tw/' + id + '/delete');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Specialist

    getAllSpecialist = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/specialist/tw/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllSpecialistMaster = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/specialist/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createSpecialist = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/specialist/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveSpecialist = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/specialist/approve/' + id, '');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    disApproveSpecialist = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/specialist/' + id + '?authStat=UNAUTHORIZED');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editSpecialist = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/specialist/tw/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteSpecialist = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/specialist/tw/' + id + '/delete');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Role
    getAllRole = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/roles/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createRole = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/roles/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editRole = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/roles/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteRole = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/roles/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Scope
    getAllScope = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/scopes');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createScope = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/scopes/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editScope = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/scopes/update/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteScope = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/scopes/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Front Office

    getAllPurpose = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/purpose/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPurposeTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/purpose/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createPurpose = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/purpose/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approvePurpose = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/purpose/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editPurpose = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/purpose/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deletePurpose = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/purpose/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Source

    getAllSource = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/source/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllSourceTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/source/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createSource = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/source/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveSource = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/source/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editSource = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/source/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteSource = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/source/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Complain Type

    getAllComplainType = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/complaint-type/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllComplainTypeTw = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/complaint-type/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createComplainType = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/complaint-type/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveComplainType = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/complaint-type/work-table/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editComplainType = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/complaint-type/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteComplainType = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/complaint-type/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Charges

    getAllCharges = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/charges/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllTmCharges = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/charges/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createCharges = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/charges/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveCharges = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/charges/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editCharges = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/charges/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteCharges = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/charges/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //ChargeCategory
    getAllChargesCategory = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/charge-category/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllTmChargesCategory = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/charge-category/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createChargesCategory = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/charge-category/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveChargesCategory = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/charge-category/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editChargesCategory = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/charge-category/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteChargesCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/charge-category/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Charge Type
    getAllChargesType = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/charge-types/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllTmChargesType = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/charge-types/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllChargeCategoryByChargeType = async (chargeTypeId:any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/charge-category/chargeType/' + chargeTypeId);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllChargeNameByCategoryId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/charges/charge_category/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createChargesType = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/charge-types/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveChargesType = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/charge-types/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editChargesType = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/charge-types/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteChargesType = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/charge-types/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Tax Category
    getAllTaxCategory = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/tax-category/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllTmTaxCategory = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/tax-category/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createTaxCategory = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/tax-category/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveTaxCategory = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/tax-category/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editTaxCategory = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/tax-category/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteTaxCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/tax-category/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Unit Type
    getAllUnitType = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/unit-type/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllTmUnitType = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/unit-type/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createUnitType = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/unit-type/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveUnitType = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/unit-type/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editUnitType = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/unit-type/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteUnitType = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/unit-type/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Referral

    getAllReferralCategory = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/referral-category/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllReferralCategoryTm = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/referral-category/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createReferralCategory = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/referral-category/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveReferralCategory = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/referral-category/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editReferralCategory = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/referral-category/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteReferralCategory = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/referral-category/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Commission

    getAllCommission = async () => {

        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/commission/master-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllReferralCommissionWt = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/commission/work-table');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createCommission = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/commission/work-table', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveReferralCommission = async (id: any, url: any) => {
        try {
            let data: any = await this.httpClientWrapper.patch('admin-management-services/commission/' + id + '/authorize?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editCommission = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/commission/work-table/' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteCommission = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/commission/work-table/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }
}
export default SetupApiService;