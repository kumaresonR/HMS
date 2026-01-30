import HttpClientWrapper from "../../http-client-wrapper";

class ReferralApiService {
  
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllReferralPerson = async() => {

        try{
            let data:any= await this.httpClientWrapper.get('admin-management-services/referral-person/all' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getReferralPersonById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('admin-management-services/referral-person/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createReferralPerson = async(payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.post('admin-management-services/referral-person/add',payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editReferralPerson = async(id:any, payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.put('admin-management-services/referral-person/'+id, payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteReferralPerson = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('admin-management-services/referral-person/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    // setep

    getAllReferralCategory = async() => {

        try{
            let data:any= await this.httpClientWrapper.get('admin-management-services/referral-category/master-table' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getReferralCategoryById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('admin-management-services/referral-person/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createReferralCategory = async(payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.post('admin-management-services/referral-person/add',payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editReferralCategory = async(id:any, payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.put('admin-management-services/referral-person/'+id, payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteReferralCategory = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('admin-management-services/referral-person/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    // commission 

    getAllCommission = async() => {

        try{
            let data:any= await this.httpClientWrapper.get('admin-management-services/commission/master-table' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getCommissionById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('admin-management-services/referral-person/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createCommission = async(payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.post('admin-management-services/referral-person/add',payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editCommission = async(id:any, payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.put('admin-management-services/referral-person/'+id, payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteCommission = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('admin-management-services/referral-person/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

}
export default ReferralApiService;