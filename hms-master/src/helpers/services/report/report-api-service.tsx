import HttpClientWrapper from "../../http-client-wrapper";

class ReportApiService {
  
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAllPathologyReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pathology-bills/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportPathologyReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.download(
                'billing-management-services/pathology-bills/search/download' + url,
                true
            );
            // let data: any = await this.httpClientWrapper.get('billing-management-services/pathology-bills/search/download' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }


    getAllRadiologyReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/radiology-bills/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportRadiologyReport = async (url: any) => {

        try {

            let data: any = await this.httpClientWrapper.download(
                'billing-management-services/radiology-bills/search/download' + url,
                true
            );
            return (data);
        } catch (error) {
            throw error;
        }
    }


    getAllPharmacyReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/pharmacy-bill/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }


    exportPharmacyReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'billing-management-services/pharmacy-bill/search/download' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getAllExpiryMedicineReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/purchase-medicine/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllMedicineReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('billing-management-services/add-medicine/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Blood band
    getAllBloodIssueReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/reports/blood/issue' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllComponentReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/reports/blood/component' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportComponentReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'bloodbank-management-services/reports/blood/component/download' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getAllDonorReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('bloodbank-management-services/reports/blood/donor' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportDonorReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'bloodbank-management-services/reports/blood/donor/download' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    // Ambulance 

    getAllAmbulanceReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ambulance-management-services/reports/ambulance/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportAmbulanceReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('ambulance-management-services/reports/payments/download' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // Birth & death report

    getAllBirthReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/birth/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllDeathReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/death/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Inventory

    getAllInventoryStockReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/inventory-stock/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllInventoryItemReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/inventory-item/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllInventoryIssueReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/inventory-issue/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // OT report

    getAllOTReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/ot/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Appointment 

    getAllAppointmentReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/oppointment/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportAppointmentReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'patient-management-services/appointment/filterAppointments/download' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    //OPD

    getAllOpdReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPatientAppointmentReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('patient-management-services/appointment/filter/appointments' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllOpdChargesReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opdReports/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportOpdChargesReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'opd-management-services/opdReports/charges/download' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getAllOpdPaymentReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('opd-management-services/opdReports/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportOpdPaymentReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'opd-management-services/opdReports/payments/download' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getAllOpdBalanceReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/blood-issue/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllDischargeReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/radiology-bills/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportOpdReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'opd-management-services/opdReports/reports/download' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    //IPD

    getAllIpdReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportIPDReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'ipd-management-services/ipd-reports/download' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };


    getAllIpdPaymentReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-reports/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    exportIPDPaymentReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'ipd-management-services/ipd-reports/payments/download' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    exportIPDChargesReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'ipd-management-services/ipd-reports/charges/download' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getAllIpdChargesReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('ipd-management-services/ipd-reports/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllIpdBalanceReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/ipd-balance/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllIpdDischargeReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/ipd-discharge/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // HR Report

    getAllPayrollReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/payroll/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllPayrollMonthReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/opd/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    getAllStaffAttendanceReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/blood-issue/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //TPA Report

    getAllTPAReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/radiology-bills/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Patient Report

    getAllPatientVisitReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('report-management-services/patient/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Finance

    getAllIncomeReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('finance-management-services/reports/income/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportIncomeReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'finance-management-services/reports/income/export/excel' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getAllExpenceReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('finance-management-services/reports/expense/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportExpenceReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'finance-management-services/reports/expense/export/excel' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getAllProfitLossReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('finance-management-services/reports/profitOrLoss/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportProfitLossReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'finance-management-services/reports/profitOrLoss/export/excel' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getAllMonthlyIncomeReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('finance-management-services/monthly-reports/income/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportMonthlyIncomeReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'finance-management-services/monthly-reports/income/export/excel' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getAllMonthlyExpenceReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('finance-management-services/monthly-reports/expense/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportMonthlyExpenceReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'finance-management-services/monthly-reports/expense/export/excel' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getAllMonthlyProfitLossReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('finance-management-services/monthly-reports/profitAndLoss/' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportMonthlyProfitLossReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'finance-management-services/monthly-reports/profitOrLoss/export/excel' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getAllAdditionalIncomeReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('finance-management-services/income-records/additional-income/' + url);
            // let data: any = await this.httpClientWrapper.get('finance-management-services/reports/income/' + url);

            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportAdditionalIncomeReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'finance-management-services/income-records/additional-income/export/excel' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    // Finance - additional expense report

    getAllAdditionalExpenseReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.get('finance-management-services/expenses/additional-expense/' + url);
            // let data: any = await this.httpClientWrapper.get('finance-management-services/reports/income/' + url);

            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportAdditionalExpenseReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'finance-management-services/expenses/additional-expense/export/excel' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    // Inventory

    getItemStockReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('inventory-management-services/item-stock/all-search' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportItemStockReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'inventory-management-services/item-stock/download-item-stock' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getIssueItemReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('inventory-management-services/add-issue-item/all-search' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportIssueItemReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'inventory-management-services/add-issue-item/download-issue-items' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    //birth death

    getBirthReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('birth-death-management-services/birth-records/all-search' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportBirthReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'birth-death-management-services/birth-records/download-birth-records' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    getDeathReport = async (url: any) => {

        try {
            let data: any = await this.httpClientWrapper.get('birth-death-management-services/death-records/all-search' + url);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    exportDeathReport = async (url: any) => {
        try {
            let data: any = await this.httpClientWrapper.download(
                'birth-death-management-services/death-records/download-death-records' + url,
                true
            );
            return data;
        } catch (error) {
            throw error;
        }
    };
}
export default ReportApiService;