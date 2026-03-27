import HttpClientWrapper from "../../http-client-wrapper";

class DashboardApiService {
  
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllIncome = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getMonthlyIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/all-monthly-incomes-percentage' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getMonthlyIncomeVsExpence = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/all-monthly-income-expense' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getOpdIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/opd-income' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getIpdIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/ipd-income' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getPathologyIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/pathology-income' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getRadiologyIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/radiology-income' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getPharmacyIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/pharmacy-income' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getBloodBankIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/bloodBank-income' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAmbulanceIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/ambulance-income' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getGeneralIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/general-income');
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getGeneralExpence = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/expense');
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllPharmacyIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/all-pharmacy-income' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getMonthlyPharmacyIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/monthly-pharmacySale' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllCommonMedicines = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('dashboard-management-services/dashboard/Common-Medicines' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllUnreadMessage = async(doctorId:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('notification-management-services/notifications/' + doctorId + '/unread' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllReadMessage = async(notificationId:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('notification-management-services/notifications/'+ notificationId +'/mark-read');
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllOPDIncome = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('opd-management-services/opd-payments/income-list/'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllIPDIncome = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('ipd-management-services/ipd-payments/income-list/'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllAmbulanceIncome = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('ambulance-management-services/ambulance_call/income-list/'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllBloodBankIncome = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('bloodbank-management-services/issue-blood/income-list/'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllBloodBankIssueIncome = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('bloodbank-management-services/issue-component/income-list/'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllPathologyIncome = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('billing-management-services/pathology-bills/income-list/'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    viewAllPharmacyIncome = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('billing-management-services/pharmacy-bill/income-list/'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllRadiologyIncome = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('billing-management-services/radiology-bills/income-list/'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllTotalIncome = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('finance-management-services/expenses/list/'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

}
export default DashboardApiService;