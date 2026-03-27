package com.hms.services.ambulancemanagement.model;

import lombok.Data;

@Data
public class BillSummary {

    private String ipdOrOpdId;
    private Double totalNetAmount;
    private Double totalPaymentAmount;
    private Double percentageToPaid;

    public BillSummary(String ipdOrOpdId, Double totalNetAmount, Double totalPaymentAmount) {
        this.ipdOrOpdId = ipdOrOpdId;
        this.totalNetAmount = totalNetAmount;
        this.totalPaymentAmount = totalPaymentAmount;
        this.percentageToPaid = calculatePercentage(totalNetAmount, totalPaymentAmount);
    }

    private Double calculatePercentage(Double totalNetAmount, Double totalPaymentAmount) {
        if (totalNetAmount == null || totalNetAmount == 0) {
            return 0.0;
        }
        return (totalPaymentAmount / totalNetAmount) * 100;
    }
}


