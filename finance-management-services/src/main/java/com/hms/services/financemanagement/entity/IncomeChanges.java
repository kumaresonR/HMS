package com.hms.services.financemanagement.entity;

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

