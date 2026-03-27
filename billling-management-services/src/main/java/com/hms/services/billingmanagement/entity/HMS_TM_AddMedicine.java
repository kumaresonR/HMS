package com.hms.services.billingmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_ADD_MEDICINE")
public class HMS_TM_AddMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ADD_MEDICINE_ID")
    private String addMedicineId;

    @Column(name = "NAME")
    private String name;

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "COMPANY_ID")
    private String companyId;

    @Column(name = "BATCH_NO", length = 50)
    private String batchNo;

    @Column(name = "EXPIRY_DATE")
    private String expiryDate;

    @Column(name = "SALE_PRICE")
    private Double salePrice;

    @Column(name = "AMOUNT")
    private Double amount;

    @Column(name = "TAX")
    private Double tax;

    @Column(name = "BOX_PACKING")
    private Integer boxPacking;

    @Column(name = "IS_DELETED")
    private Boolean isDeleted = false;

    @Column(name = "PURCHASE_DATE")
    private LocalDateTime purchaseDate;

    @Column(name = "SUPPLIER_ID", length = 100)
    private String supplierId;

}


