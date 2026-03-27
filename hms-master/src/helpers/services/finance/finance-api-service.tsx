import HttpClientWrapper from "../../http-client-wrapper";

class FinanceApiService {
  
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllIncome = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('finance-management-services/income-records/all' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getIncomeById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('finance-management-services/income-records/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createIncomeRecord = async(formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.postFormData('/finance-management-services/income-records/create',formData );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editIncome = async(id:any, formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.putFormData('finance-management-services/income-records/'+id, formData );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteIncome = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('finance-management-services/income-records/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllExpenses = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('finance-management-services/expenses/all' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getExpensesById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('finance-management-services/expenses/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createExpenceRecord = async(formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.postFormData('finance-management-services/expenses/create',formData );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editExpenses = async(id:any, payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.put('finance-management-services/expenses/'+id, payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteExpenses = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('finance-management-services/expenses/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }
}
export default FinanceApiService;