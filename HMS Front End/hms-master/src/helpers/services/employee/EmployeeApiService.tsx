import HttpClientWrapper from "../../http-client-wrapper";

class EmployeeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getShiftByEmployeeId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/shifts/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    scheduleDoctorAvailability = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/shifts/create', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editDoctorAvailability = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/shifts/update', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteDoctorAvailability = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/shifts/deleteSchedule/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getTimeSlot = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/shifts/getTimeSlotBySchedule/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllRole = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/roles/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    searchAllEmployeeByRoleAndName = async(url:any) => {
        try{
            let data:any= await this.httpClientWrapper.get('admin-management-services/employees/role/search?'+url );
            return(data);     
        }catch (error){
            throw error;
        }
    }
    searchAllEmployee = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/employees/search?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllEmployee = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/employees/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getEmployeeById = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/employees/employeerole/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createEmployee = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('admin-management-services/employees/create', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    editEmployee = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('admin-management-services/employees/update/' + id, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllDepartment = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/department/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllDesignation = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/designation/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllSpecialist = async () => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/specialist/tm/all');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    applyLeaveRequest = async (id: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/leaves/apply?employeeId=' + id, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMonthlyPayLeave = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/leaves/monthly/leave-summary?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllLeaveRequest = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/leaves/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    approveLeaveRequest = async (id: any, url: any, payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/leaves/' + id + url, payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    deleteLeaveRequest = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/leaves/remove/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllLeaveByEmployeeId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/employees/' + id + '/leaves');
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllAttendance = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/attendance/employees?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPayroll = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/api/payroll/payroll-status?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMonthlyPaySlip = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/api/payroll/monthly/salarySlip?' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPayrollByEmployeeId = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/api/payroll/generate/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    generatePayroll = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/api/payroll/generate', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    proceedToPay = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('admin-management-services/api/payroll/proceedToPay/' + id, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    viewPaySlip = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('admin-management-services/employees/create', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPaySlipId = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/api/payroll/ViewSalary/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    staffAttendance = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('admin-management-services/attendance/save', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    updateStaffAttendance = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.put('admin-management-services/attendance/update', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllTimeline = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/timeline/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getTimeLineByIpdId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/timeline/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    createTimeline = async (formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.postFormData('admin-management-services/timeline/create', formData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    editTimeline = async (id: any, formData: FormData) => {
        try {
            let data: any = await this.httpClientWrapper.putFormData('admin-management-services/timeline/' + id, formData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    deleteTimeLine = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.delete('admin-management-services/timeline/delete/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getPayrollSummaryByEmployeeId = async (id: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('admin-management-services/api/payroll/summary/' + id);
            return (data);
        } catch (error) {
            throw error;
        }
    }

}
export default EmployeeApiService;