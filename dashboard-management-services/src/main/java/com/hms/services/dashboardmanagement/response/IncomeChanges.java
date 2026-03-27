package com.hms.services.dashboardmanagement.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IncomeChanges {
    private Double todayIncome;
    private String percentageChangeFromYesterday;
}


