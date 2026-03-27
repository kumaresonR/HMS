import HttpClientWrapper from "../../http-client-wrapper";

class BloodBankApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllDonor = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/donors/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getDonorById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/donors/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getDonorIdByBagDetails = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/bag-stock/' + id + '/bag-stocks');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createDonor = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('bloodbank-management-services/donors/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editDonor = async(id:any, payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.put('bloodbank-management-services/donors/'+id, payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteDonor = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('bloodbank-management-services/donors/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }
    getAllIssueBlood = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/issue-blood/'+url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchIssueBloodBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/issue-blood/search?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }
   
    CreateIssueBlood = async(formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.postFormData('bloodbank-management-services/issue-blood/generate',formData );
            return(data);    
        }catch (error){
            throw error;
        }
    }

    editBloodIssue = async(id:any, formData: FormData) => {
        try{
            let data:any= await this.httpClientWrapper.putFormData('bloodbank-management-services/issue-blood/'+id, formData );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteBloodIssue = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('bloodbank-management-services/issue-blood/delete/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllBags = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/bag-stock');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createComponent = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('bloodbank-management-services/blood-component/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllComponents = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/blood-component/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteComponent = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('bloodbank-management-services/blood-component/delete/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllComponentIssue = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/issue-component/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchComponentIssueBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/issue-component/search?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createComponentIssue = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('bloodbank-management-services/issue-component/generate', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editComponentIssue = async(id:any, formData: FormData) => {
        try{
            let data:any= await this.httpClientWrapper.putFormData('bloodbank-management-services/issue-component/'+id, formData );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteComponentIssue = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('bloodbank-management-services/issue-component/delete/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    CreateBloodDonor = async(formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.postFormData('bloodbank-management-services/blood-donor/generate',formData );
            return(data);    
        }catch (error){
            throw error;
        }
    }

    getAllBloodDonor = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/blood-donor/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllBagStock = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('/bloodbank-management-services/bag-stock');
            return (data);
        } catch (error) {
            throw error;
        }
    }
    
    CreateBagStock = async(formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.postFormData('bloodbank-management-services/bag-stock/create',formData );
            return(data);    
        }catch (error){
            throw error;
        }
    }

    deleteBag = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('bloodbank-management-services/bag-stock/delete/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }
    
}
export default BloodBankApiService;