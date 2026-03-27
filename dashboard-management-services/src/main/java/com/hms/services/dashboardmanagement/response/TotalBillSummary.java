package com.hms.services.dashboardmanagement.response;

import lombok.Data;

@Data
public class TotalBillSummary {

    private BillSummary pathologyBilling;
    private BillSummary radiologyBilling;
    private BillSummary pharmacyBilling;
    private BillSummary bloodBankBilling;
    private BillSummary ambulanceBilling;

    @Data
    public static class BillSummary {
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
}


