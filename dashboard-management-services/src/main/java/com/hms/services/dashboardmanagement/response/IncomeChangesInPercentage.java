package com.hms.services.dashboardmanagement.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IncomeChangesInPercentage {

    private String ipdPercentageChange;
    private String opdPercentageChange;
    private String pharmacyPercentageChange;
    private String radiologyPercentageChange;
    private String pathologyPercentageChange;
    private String bloodBankPercentageChange;
    private String ambulancePercentageChange;
    private Double generalIncome;
    private Double expense;
}


