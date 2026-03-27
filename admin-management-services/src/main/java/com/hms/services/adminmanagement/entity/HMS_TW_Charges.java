package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TW_CHARGES")
public class HMS_TW_Charges {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CHARGE_ID")
    private String chargeId;

    @Column(name = "CHARGE_TYPE_ID", nullable = false, length = 100)
    private String chargeTypeId;

    @Column(name = "CATEGORY_ID", nullable = false, length = 100)
    private String categoryId;

    @Column(name = "UNIT_TYPE_ID", nullable = false, length = 100)
    private String unitTypeId;

    @Column(name = "TAX_CATEGORY_ID")
    private String taxCategoryId;

    @Column(name = "CHARGE_NAME")
    private String chargeName;

    @Column(name = "TAX_PERCENTAGE")
    private Double taxPercentage;

    @Column(name = "STANDARD_CHARGE", nullable = false)
    private Double standardCharge;

    @Lob
    @Column(name = "DESCRIPTION", columnDefinition = "text")
    private String description;

//    @Column(name = "HEALTH_LIFE_INSURANCE")
//    private Double healthLifeInsurance;
//
//    @Column(name = "STAR_HEALTH_INSURANCE", nullable = false)
//    private Double starHealthInsurance;
//
//    @Column(name = "IDBI_FEDERAL")
//    private Double IDBIFederal;
//
//    @Column(name = "CGHS")
//    private Double CGHS;

    @Column(name = "MOD_NO",nullable = false,length = 10)
    private String modNo;

    @Column(name = "AUTH_STAT", nullable = false, length = 15)
    private String authStat;

    @Column(name = "RECORD_STAT", nullable = false, length = 10)
    private String recordStat;

    @Column(name = "IS_ACTIVE", nullable = false)
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


