package com.hms.services.billingmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_MEDICINE")
public class HMS_TM_Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MEDICINE_ID")
    private String medicineId;

    @Column(name = "PHARMACY_BILL_ID")
    private String pharmacyBillId;

    @Column(name = "MEDICINE_CATEGORY")
    private String medicineCategory;

    @Column(name = "MEDICINE_NAME")
    private String medicineName;

    @Column(name = "BATCH_NO")
    private String batchNo;

    @Column(name = "EXPIRY_DATE")
    private String expiryDate;

    @Column(name = "QUANTITY")
    private Integer quantity;

    @Column(name = "AVAILABLE_QTY")
    private Integer availableQty;

    @Column(name = "SALE_PRICE")
    private Double salePrice;

    @Column(name = "TAX")
    private Double tax;

    @Column(name = "AMOUNT")
    private Double amount;

}


