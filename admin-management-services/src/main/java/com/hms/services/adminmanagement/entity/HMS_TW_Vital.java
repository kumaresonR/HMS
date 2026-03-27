package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TW_VITAL")
public class HMS_TW_Vital {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "VITAL_ID")
    private String vitalId;

    @Column(name = "VITAL_NAME", nullable = false, length = 100)
    private String vitalName;

    @Column(name = "REFERENCE_FROM", nullable = true)
    private String referenceFrom;

    @Column(name = "REFERENCE_TO", nullable = true)
    private String referenceTo;

    @Column(name = "UNIT", length = 20)
    private String unit;

    @Column(name = "MOD_NO",nullable = false,length = 10)
    private String modNo;

    @Column(name = "AUTH_STAT", nullable = false, length = 15)
    private String authStat;

    @Column(name = "RECORD_STAT", nullable = false, length = 10)
    private String recordStat;

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



