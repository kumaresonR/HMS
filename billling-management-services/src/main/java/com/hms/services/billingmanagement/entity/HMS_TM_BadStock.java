package com.hms.services.billingmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_BAD_STOCK")
public class HMS_TM_BadStock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "ADD_MEDICINE_ID")
    private String addMedicineId;

    @Column(name = "BATCH_NO")
    private String batchNo;

    @Column(name = "EXPIRY_DATE")
    private String expiryDate;

    @Column(name = "OUTWARD_DATE")
    private Date outwardDate;

    @Column(name = "QTY")
    private Integer qty;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "DELETED")
    private Boolean deleted = false;
}



