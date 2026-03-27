package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HMS_TM_AddMedicineDTO {

    private String addMedicineId;
    private String name;
    private String category;
    private String companyId;
    private HMS_TM_AddCompany companyDetails;
    private String batchNo;
    private String expiryDate;
    private Double salePrice;
    private Double amount;
    private Double tax;
    private Integer boxPacking;
    private Boolean isDeleted;
    private LocalDateTime purchaseDate;
    private HMS_TM_Supplier supplierDetails;
}


