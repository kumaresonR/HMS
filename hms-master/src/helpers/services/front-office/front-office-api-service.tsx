import HttpClientWrapper from "../../http-client-wrapper";

class FrontOfficeApiService {
  
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllPhoneCall = async() => {

        try{
            let data:any= await this.httpClientWrapper.get('frontoffice-management-services/front-office/phonecalllogs' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getPhoneCallById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('frontoffice-management-services/front-office/phonecalllog/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createPhoneCall = async(payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.post('/frontoffice-management-services/front-office/phonecalllog/add',payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editPhoneCall = async(id:any, payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.put('frontoffice-management-services/front-office/phonecalllog/'+id, payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deletePhoneCall = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('frontoffice-management-services/front-office/phonecalllog/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    // Visitors

    getAllVisitors = async() => {

        try{
            let data:any= await this.httpClientWrapper.get('frontoffice-management-services/front-office/visitors' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getVisitorsById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('frontoffice-management-services/front-office/visitor/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createVisitors = async(payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.post('frontoffice-management-services/front-office/visitor/add',payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editVisitors = async(id:any, payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.put('frontoffice-management-services/front-office/visitor/'+id, payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteVisitors = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('frontoffice-management-services/front-office/visitor/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    // Complain  

    getAllComplain = async() => {

        try{
            let data:any= await this.httpClientWrapper.get('frontoffice-management-services/front-office/complaints' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getComplainById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('frontoffice-management-services/front-office/complaint/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createComplain = async(payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.post('/frontoffice-management-services/front-office/complaint/add',payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editComplain = async(id:any, payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.put('frontoffice-management-services/front-office/complaint/'+id, payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteComplain = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('frontoffice-management-services/front-office/complaint/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

}
export default FrontOfficeApiService;