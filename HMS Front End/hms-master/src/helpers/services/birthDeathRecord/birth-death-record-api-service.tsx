import HttpClientWrapper from "../../http-client-wrapper";

class BirthDeathRecordApiService {
  
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllBirthRecord = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('birth-death-management-services/birth-records/all' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    searchBirthRecordBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('birth-death-management-services/birth-records/search?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getBirthRecordById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('birth-death-management-services/birth-records/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createBirthRecord = async(formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.postFormData('birth-death-management-services/birth-records/generate',formData );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editBirthRecord = async(id:any, formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.putFormData('birth-death-management-services/birth-records/'+id, formData );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteBirthRecord = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('birth-death-management-services/birth-records/delete/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllDeathRecord = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('birth-death-management-services/death-records/all' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    searchDeathRecordBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('birth-death-management-services/death-records/search?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getDeathRecordById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('birth-death-management-services/death-records/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createDeathRecord = async(formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.postFormData('birth-death-management-services/death-records/create',formData );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editDeathRecord = async(id:any, formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.putFormData('birth-death-management-services/death-records/'+id, formData );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteDeathRecord = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('birth-death-management-services/death-records/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }
}
export default BirthDeathRecordApiService;