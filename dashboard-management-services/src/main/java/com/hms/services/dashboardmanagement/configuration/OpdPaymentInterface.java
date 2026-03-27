package com.hms.services.dashboardmanagement.configuration;


import com.hms.services.dashboardmanagement.response.IncomeChanges;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="opd-management-services")
public interface OpdPaymentInterface {
    @GetMapping("/opd-payments/opd-income")
    public IncomeChanges getOPDIncome();
    @GetMapping("/opd-payments/opd-monthly-income")
    public Double getOPDMonthlyIncome();
    @GetMapping("/opd-admissions/medical-history/{patientId}")
    public Integer getMedicalHistoryOpdId(@PathVariable String patientId);
    @GetMapping("/opd-payments/increase-weekly-income")
    public IncomeChanges getOPDIncreaseWeeklyIncome();
    @GetMapping("/opd-payments/increase-yearly-income")
    public IncomeChanges getOPDIncreaseYearlyIncome();
    @GetMapping("/opd-payments/increase-monthly-income")
    public IncomeChanges getOPDIncreaseMonthlyIncome();
}


