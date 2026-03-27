import HttpClientWrapper from "../../http-client-wrapper";

class AmbulanceApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllAmbulanceList  = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ambulance-management-services/ambulance_vehicle/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createAmbulanceList = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('ambulance-management-services/ambulance_vehicle/add', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editAmbulanceList = async(id:any, payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.put('ambulance-management-services/ambulance_vehicle/update/'+id, payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteAmbulance = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('ambulance-management-services/ambulance_vehicle/delete/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAllAmbulanceCall = async (url:any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ambulance-management-services/ambulance_call/'+url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchAmbulanceCallBySearchTearm = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ambulance-management-services/ambulance_call/search?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    addAmbulanceCall = async(formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.postFormData('ambulance-management-services/ambulance_call/add',formData );
            return(data);    
        }catch (error){
            throw error;
        }
    }

    addAmbulancePayment = async(id:any, formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.postFormData('ambulance-management-services/ambulance_call/payment/add/'+id, formData );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editAmbulanceCall = async(id:any,formData:FormData) => {
        try{
            let data:any= await this.httpClientWrapper.putFormData('ambulance-management-services/ambulance_call/update/'+id,formData );
            return(data);    
        }catch (error){
            throw error;
        }
    }

    deleteAmbulanceCall = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('ambulance-management-services/ambulance_call/delete/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }
    
}
export default AmbulanceApiService;