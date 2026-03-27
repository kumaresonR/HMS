package com.hms.services.opdmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Data
@Entity
@Table(name="HMS_TM_OPD_CHARGES")
public class HMS_TM_OPDCharges {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "OPD_CHARGE_ID")
    private String opdChargeId;

    @Column(name = "OPD_ID")
    private String opdId;

    @Column(name = "CHARGE_TYPE_ID")
    private String chargeTypeId;

    @Column(name = "CHARGE_CATEGORY_ID")
    private String chargeCategoryId;

    @Column(name = "CHARGE_NAME_ID")
    private String chargeNameId;

    @Column(name = "STANDARD_CHARGE", nullable = false)
    private Double standardCharge;

    @Column(name = "TPA_CHARGE")
    private Double tpaCharge;

    @Column(name = "QTY")
    private Float qty;

    @Column(name = "TOTAL")
    private Float total;

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

    @Lob
    @Column(name = "CHARGE_NOTE", columnDefinition = "text")
    private String chargeNote;

    @Column(name = "DATE", columnDefinition = "timestamp")
    private LocalDateTime date;

    @Column(name = "APPLY_TPA")
    private boolean applyTpa=false;

    @Column(name = "IS_GST_ADDED")
    private boolean isGstAdded;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;



}

