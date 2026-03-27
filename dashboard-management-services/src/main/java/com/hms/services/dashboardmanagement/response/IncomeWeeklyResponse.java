package com.hms.services.dashboardmanagement.response;

import lombok.Data;

@Data
public class IncomeWeeklyResponse {

    private Double ipdIncome;
    private String ipdPercentageChangeFromWeekly;
    private Double opdIncome;
    private String opdPercentageChangeFromWeekly;
    private Double pharmacyIncome;
    private String pharmacyPercentageChangeFromWeekly;
    private Double radiologyIncome;
    private String radiologyPercentageChangeFromWeekly;
    private Double pathologyIncome;
    private String pathologyPercentageChangeFromWeekly;
    private Double bloodBankIncome;
    private String bloodBankPercentageChangeFromWeekly;
    private Double ambulanceIncome;
    private String ambulancePercentageChangeFromWeekly;
    private Double generalIncome;
    private String generalPercentageChangeFromWeekly;
    private Double expense;
    private String expensePercentageChangeFromWeekly;



}


