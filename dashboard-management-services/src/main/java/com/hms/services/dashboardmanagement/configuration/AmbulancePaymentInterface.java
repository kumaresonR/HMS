package com.hms.services.dashboardmanagement.configuration;


import com.hms.services.dashboardmanagement.response.IncomeChanges;
import com.hms.services.dashboardmanagement.response.TotalBillSummary;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="ambulance-management-services")
public interface AmbulancePaymentInterface {
    @GetMapping("/ambulance_call/income")
    public IncomeChanges getAmbulanceIncome();
    @GetMapping("/ambulance_call/monthly-income")
    public Double getAmbulanceMonthlyIncome();
    @GetMapping("/ambulance_call/OpdOrIpd/ambulance-payment/{id}")
    public TotalBillSummary.BillSummary getAmbulanceOpdAndIpdPayment(@PathVariable String id);
    @GetMapping("/ambulance_call/medical-history/{patientId}")
    public Integer getMedicalHistoryAmbulance(@PathVariable String patientId);
    @GetMapping("/ambulance_call/increase-weekly-income")
    public IncomeChanges getAmbulanceIncreaseWeeklyIncome();
    @GetMapping("/ambulance_call/increase-yearly-income")
    public IncomeChanges getAmbulanceIncreaseYearlyIncome();
    @GetMapping("/ambulance_call/increase-monthly-income")
    public IncomeChanges getAmbulanceIncreaseMonthlyIncome();

}


