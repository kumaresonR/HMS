package com.hms.services.ambulancemanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name="HMS_TM_ADDAMBULANCECALL")
public class HMS_TM_AddAmbulanceCall {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "VEHICLE_CHARGE_ID")
    private String vehicleChargeId;

    @Column(name = "PATIENT_ID")
    private String patientId;

    @Column(name = "CASE_ID")
    private String caseId;

    @Column(name = "IPD_OR_OPD_ID")
    private String ipdOrOpdId;

    @Column(name = "BILL_NO")
    private String billNo;

    @Column(name = "VEHICLE_ID")
    private String vehicleId;

    @Column(name = "VEHICLE_MODEL", nullable = false)
    private String vehicleModel;

    @Column(name = "DRIVER_NAME")
    private String driverName;

    @Column(name = "CHARGE_CATEGORY")
    private String chargeCategory;

    @Column(name = "CHARGE_NAME")
    private String chargeName;

    @Column(name = "STANDARD_CHARGE")
    private Double standardCharge;

    @Lob
    @Column(name = "NOTE", columnDefinition = "text")
    private String note;

    @Column(name = "TOTAL")
    private Double total;

    @Column(name = "DISCOUNT_AMOUNT")
    private Double discountAmount;

    @Column(name = "DISCOUNT_PERCENTAGE")
    private Double discountPercentage;

    @Column(name = "TAX_AMOUNT")
    private Double taxAmount;

    @Column(name = "TAX_PERCENTAGE")
    private Double taxPercentage;

    @Column(name = "NET_AMOUNT")
    private Double netAmount;

    @Column(name = "BALANCE_AMOUNT")
    private Double balanceAmount;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "IS_GST_ADDED")
    private boolean isGstAdded;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;




}


