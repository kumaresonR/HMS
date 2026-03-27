package com.hms.services.dashboardmanagement.response;

import lombok.Data;

@Data
public class IncomeYearlyResponse {

    private Double ipdIncome;
    private String ipdPercentageChangeFromYearly;
    private Double opdIncome;
    private String opdPercentageChangeFromYearly;
    private Double pharmacyIncome;
    private String pharmacyPercentageChangeFromYearly;
    private Double radiologyIncome;
    private String radiologyPercentageChangeFromYearly;
    private Double pathologyIncome;
    private String pathologyPercentageChangeFromYearly;
    private Double bloodBankIncome;
    private String bloodBankPercentageChangeFromYearly;
    private Double ambulanceIncome;
    private String ambulancePercentageChangeFromYearly;
    private Double generalIncome;
    private String generalPercentageChangeFromYearly;
    private Double expense;
    private String expensePercentageChangeFromYearly;



}


