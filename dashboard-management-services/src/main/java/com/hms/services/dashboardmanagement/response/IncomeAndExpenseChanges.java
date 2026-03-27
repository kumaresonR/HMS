package com.hms.services.dashboardmanagement.response;

import lombok.Data;

import java.util.Map;

@Data
public class IncomeAndExpenseChanges {
    private Map<Integer, Double> income;
    private Map<Integer, Double> expense;
}


