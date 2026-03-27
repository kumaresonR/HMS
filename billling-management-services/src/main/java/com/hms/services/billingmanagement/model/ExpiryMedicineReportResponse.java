package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ExpiryMedicineReportResponse {
    private String medicineName;
    private String batchNo;
    private String medicineCategory;;
    private String expireDate;
    private Integer quantity;
}

