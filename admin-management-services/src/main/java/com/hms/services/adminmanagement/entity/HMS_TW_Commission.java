package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TW_COMMISSION")
public class HMS_TW_Commission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "COMMISSION_ID")
    private String commissionId;

    @Column(name = "CATEGORY_ID", nullable = false, length = 100)
    private String categoryId;

    @Column(name = "MOD_NO",nullable = false,length = 10)
    private String modNo;

    @Column(name = "AUTH_STAT",nullable = false, length = 15)
    private String authStat;

    @Column(name = "RECORD_STAT",nullable = false,length = 10)
    private String recordStat;

    @Column(name = "OPD_COMMISSION", nullable = true)
    private double opdCommission;

    @Column(name = "IPD_COMMISSION", nullable = true)
    private double ipdCommission;

    @Column(name = "PHARMACY_COMMISSION", nullable = true)
    private double pharmacyCommission;

    @Column(name = "PATHOLOGY_COMMISSION", nullable = true)
    private double pathologyCommission;

    @Column(name = "RADIOLOGY_COMMISSION", nullable = true)
    private double radiologyCommission;

    @Column(name = "BLOOD_BANK_COMMISSION", nullable = true)
    private double bloodBankCommission;

    @Column(name = "AMBULANCE_COMMISSION", nullable = true)
    private double ambulanceCommission;

    @Column(name = "STANDARD_COMMISSION", nullable = true)
    private double standardCommission;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY", length = 50)
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY", length = 50)
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;



}



