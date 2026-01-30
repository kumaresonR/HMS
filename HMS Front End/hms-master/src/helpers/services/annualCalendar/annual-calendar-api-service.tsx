import HttpClientWrapper from "../../http-client-wrapper";

class AnualCalenderApiService {
  
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllAnualCalender = async() => {
        try{
            let data:any= await this.httpClientWrapper.get('admin-management-services/annual-calender/all' );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    getAnualCalenderById = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('admin-management-services/annual-calender/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    createAnualCalender = async(payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.post('/admin-management-services/annual-calender/create',payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    editAnualCalender = async(id:any, payload:any) => {
        try{
            let data:any= await this.httpClientWrapper.put('admin-management-services/annual-calender/'+id, payload );
            return(data);     
        }catch (error){
            throw error;
        }
    }

    deleteAnualCalender = async(id:any) => {
        try{
            let data:any= await this.httpClientWrapper.delete('admin-management-services/annual-calender/delete/'+id );
            return(data);     
        }catch (error){
            throw error;
        }
    }
}
export default AnualCalenderApiService;