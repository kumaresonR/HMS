package com.hms.services.dashboardmanagement.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
public class IncomeResponse {

    private Double ipdIncome;
    private String ipdPercentageChangeFromYesterday;
    private Double opdIncome;
    private String opdPercentageChangeFromYesterday;
    private Double pharmacyIncome;
    private String pharmacyPercentageChangeFromYesterday;
    private Double radiologyIncome;
    private String radiologyPercentageChangeFromYesterday;
    private Double pathologyIncome;
    private String pathologyPercentageChangeFromYesterday;
    private Double bloodBankIncome;
    private String bloodBankPercentageChangeFromYesterday;
    private Double ambulanceIncome;
    private String ambulancePercentageChangeFromYesterday;
    private Double generalIncome;
    private String generalPercentageChangeFromYesterday;
    private Double expense;
    private String expensePercentageChangeFromYesterday;



}


