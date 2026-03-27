package com.hms.services.dashboardmanagement.response;

import lombok.Data;

@Data
public class IncomeMonthlyResponse {

    private Double ipdIncome;
    private String ipdPercentageChangeFromMonthly;
    private Double opdIncome;
    private String opdPercentageChangeFromMonthly;
    private Double pharmacyIncome;
    private String pharmacyPercentageChangeFromMonthly;
    private Double radiologyIncome;
    private String radiologyPercentageChangeFromMonthly;
    private Double pathologyIncome;
    private String pathologyPercentageChangeFromMonthly;
    private Double bloodBankIncome;
    private String bloodBankPercentageChangeFromMonthly;
    private Double ambulanceIncome;
    private String ambulancePercentageChangeFromMonthly;
    private Double generalIncome;
    private String generalPercentageChangeFromMonthly;
    private Double expense;
    private String expensePercentageChangeFromMonthly;



}


