package com.hms.services.dashboardmanagement.configuration;


import com.hms.services.dashboardmanagement.response.IncomeChanges;
import com.hms.services.dashboardmanagement.response.TotalBillSummary;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="bloodbank-management-services")
public interface BloodBankPaymentInterface {
    @GetMapping("/issue-blood/blood-bank-income")
    public IncomeChanges getIssueBloodIncome();
    @GetMapping("/issue-blood/blood-bank-monthly-income")
    public Double getIssueBloodMonthlyIncome();
    @GetMapping("/issue-blood/OpdOrIpd/blood_issue-payment/{id}")
    public TotalBillSummary.BillSummary getBloodIssueOpdAndIpdPayment(@PathVariable String id);
    @GetMapping("/issue-blood/medical-history/{patientId}")
    public Integer getMedicalHistoryBloodBank(@PathVariable String patientId);
    @GetMapping("/issue-blood/increase-monthly-income")
    public IncomeChanges getBloodBankIncreaseMonthlyIncome();
    @GetMapping("/issue-blood/increase-yearly-income")
    public IncomeChanges getBloodBankIncreaseYearlyIncome();
    @GetMapping("/issue-blood/increase-weekly-income")
    public IncomeChanges getBloodBankIncreaseWeeklyIncome();

}


