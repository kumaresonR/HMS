package com.hms.services.billingmanagement.model;

import lombok.Data;


@Data
public class PurchaseMedicineDTO {
    private String medicineId;
    private String purchaseBillId;
    private String medicineCategory;
    private String medicineName;
    private String companyId;
    private HMS_TM_AddCompany companyDetails;
    private String batchNo;
    private String expiryDate;
    private Double mrp;
    private Double batchAmount;
    private Double salePrice;
    private Integer packingQty;
    private Integer quantity;
    private Double purchasePrice;
    private Double tax;
    private Double amount;
    private Integer availableQty;
}



