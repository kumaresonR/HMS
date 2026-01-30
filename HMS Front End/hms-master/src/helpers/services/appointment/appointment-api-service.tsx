import HttpClientWrapper from "../../http-client-wrapper";

class AppointmentApiService {
  
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllAppointment = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('patient-management-services/appointment/'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAppointmentById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('patient-management-services/appointment/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createAppointment = async(payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.post('patient-management-services/appointment/add',payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editAppointment = async(id:any, payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.put('patient-management-services/appointment/update/'+id, payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteAppointment = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('patient-management-services/appointment/delete/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    searchAllEmployee = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('admin-management-services/employees/search?'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    bookeToken = async(payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.post('admin-management-services/shifts/bookTimeSlot',payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }
}
export default AppointmentApiService;