package com.hms.services.adminmanagement.model;

import lombok.Data;

@Data
public class PayrollFields {
    private double basicSalary;
    private double earnings;
    private double deductions;
    private double grossSalary;
    private double taxPercentage;
    private double tax;
    private double netSalary;

    public PayrollFields() {
        this.basicSalary = 0.0;
        this.earnings = 0.0;
        this.deductions = 0.0;
        this.grossSalary = 0.0;
        this.taxPercentage = 0.0;
        this.tax = 0.0;
        this.netSalary = 0.0;
    }

}



