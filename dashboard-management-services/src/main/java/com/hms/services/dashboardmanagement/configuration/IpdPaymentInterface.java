package com.hms.services.dashboardmanagement.configuration;


import com.hms.services.dashboardmanagement.response.IncomeChanges;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name="ipd-management-services")
public interface IpdPaymentInterface {
    @GetMapping("/ipd-payments/ipd-income")
    public IncomeChanges getIPDIncome();
    @GetMapping("/ipd-payments/ipd-monthly-income")
    public Double getIPDMonthlyIncome();
    @GetMapping("/ipd-payments/increase-weekly-income")
    public IncomeChanges getIPDIncreaseWeeklyIncome();
    @GetMapping("/ipd-payments/increase-yearly-income")
    public IncomeChanges getIPDIncreaseYearlyIncome();
    @GetMapping("/ipd-payments/increase-monthly-income")
    public IncomeChanges getIPDIncreaseMonthlyIncome();
}


