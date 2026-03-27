package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TW_CHARGE_TYPE")
public class HMS_TW_ChargeType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CHARGE_TYPE_ID")
    private String chargeTypeId;

    @Column(name = "CHARGE_TYPE", nullable = false, length = 100)
    private String chargeType;

    @Column(name = "MOD_NO",nullable = false,length = 10)
    private String modNo;

    @Column(name = "AUTH_STAT",nullable = false, length = 15)
    private String authStat;

    @Column(name = "RECORD_STAT",nullable = false,length = 10)
    private String recordStat;

    @Column(name = "APPOINTMENT", nullable = false)
    private boolean appointment;

    @Column(name = "OPD", nullable = false)
    private boolean opd;

    @Column(name = "IPD", nullable = false)
    private boolean ipd;

    @Column(name = "PATHOLOGY", nullable = false)
    private boolean pathology;

    @Column(name = "RADIOLOGY", nullable = false)
    private boolean radiology;

    @Column(name = "BLOOD_BANK", nullable = false)
    private boolean bloodBank;

    @Column(name = "AMBULANCE", nullable = false)
    private boolean ambulance;

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



