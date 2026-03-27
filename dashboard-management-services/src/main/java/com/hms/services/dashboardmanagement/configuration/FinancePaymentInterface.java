package com.hms.services.dashboardmanagement.configuration;


import com.hms.services.dashboardmanagement.response.IncomeChanges;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@FeignClient(name="finance-management-services")
public interface FinancePaymentInterface {
    @GetMapping("/expenses/amount")
    public IncomeChanges getExpenseAmount();
    @GetMapping("/income-records/amount")
    public IncomeChanges getGeneralIncomeAmount();
    @GetMapping("/expenses/monthly-amount")
    public Double getMonthlyExpenseAmount();
    @GetMapping("/income-records/monthly-amount")
    public Double getMonthlyGeneralIncomeAmount();
    @GetMapping("/expenses/monthly-expense")
    public Map<Integer, Double> getMonthlyExpensePerYear();
    @GetMapping("/income-records/monthly-income")
    public Map<Integer, Double> getMonthlyGeneralIncomePerYear();
    @GetMapping("/expenses/increase-weekly-income")
    public IncomeChanges getIncreaseWeeklyExpense();
    @GetMapping("/expenses/increase-yearly-income")
    public IncomeChanges getIncreaseYearlyExpense();
    @GetMapping("/expenses/increase-monthly-income")
    public IncomeChanges getIncreaseMonthlyExpense();
    @GetMapping("/income-records/increase-monthly-income")
    public IncomeChanges getIncreaseMonthlyIncome();
    @GetMapping("/income-records/increase-yearly-income")
    public IncomeChanges getIncreaseYearlyIncome();
    @GetMapping("/income-records/increase-weekly-income")
    public IncomeChanges getIncreaseWeeklyIncome();

}


