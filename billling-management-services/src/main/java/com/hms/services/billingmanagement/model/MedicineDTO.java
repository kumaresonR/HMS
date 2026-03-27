package com.hms.services.billingmanagement.model;

import lombok.Data;

@Data
public class MedicineDTO {
    private String medicineId;
    private String pharmacyBillId;
    private String medicineCategory;
    private String medicineName;
    private String batchNo;
    private String expiryDate;
    private Integer quantity;
    private Integer availableQty;
    private Double salePrice;
    private Double tax;
    private Double amount;
}



