package com.hms.services.billingmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_PURCHASE_MEDICINE")
public class HMS_TM_PurchaseMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MEDICINE_ID")
    private String medicineId;

    @Column(name = "PURCHASE_BILL_ID")
    private String purchaseBillId;

    @Column(name = "MEDICINE_CATEGORY", length = 100)
    private String medicineCategory;

    @Column(name = "MEDICINE_NAME", length = 100)
    private String medicineName;

    @Column(name = "BATCH_NO", length = 50)
    private String batchNo;

    @Column(name = "EXPIRY_DATE")
    private String expiryDate;

    @Column(name = "MRP")
    private Double mrp;

    @Column(name = "BATCH_AMOUNT")
    private Double batchAmount;

    @Column(name = "SALE_PRICE")
    private Double salePrice;

    @Column(name = "PACKING_QTY")
    private Integer packingQty;

    @Column(name = "QUANTITY")
    private Integer quantity;

    @Column(name = "PURCHASE_PRICE")
    private Double purchasePrice;

    @Column(name = "TAX")
    private Double tax;

    @Column(name = "AMOUNT")
    private Double amount;

//    @Column(name = "AVAILABLE_QTY")
//    private Integer availableQty;

    @Column(name = "COMPANY_ID")
    private String companyId;
}


