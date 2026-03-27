package com.hms.services.adminmanagement.model;

import lombok.Data;

@Data
public class PayrollSummaryDTO {
    private double totalNetSalary;
    private double totalGrossSalary;
    private double totalEarnings;
    private double totalDeductions;

    public PayrollSummaryDTO(double totalNetSalary, double totalGrossSalary, double totalEarnings, double totalDeductions) {
        this.totalNetSalary = totalNetSalary;
        this.totalGrossSalary = totalGrossSalary;
        this.totalEarnings = totalEarnings;
        this.totalDeductions = totalDeductions;
    }
}



