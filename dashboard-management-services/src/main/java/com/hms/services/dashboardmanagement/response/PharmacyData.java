package com.hms.services.dashboardmanagement.response;

import lombok.Data;

@Data
public class PharmacyData {
    private Double pharmacyIncome;
    private String pharmacyPercentageChangeFromYesterday;
    private Double medicinePurchase;
    private String purchasePercentageChangeFromYesterday;
    private Double totalBadStock;
    private Double totalMedicineStock;
}


