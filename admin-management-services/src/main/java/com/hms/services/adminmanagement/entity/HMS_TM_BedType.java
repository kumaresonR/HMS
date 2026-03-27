package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_BEDTYPE")
public class HMS_TM_BedType {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "BEDTYPE_ID")
    private String bedTypeId;

    @Column(name = "NAME", nullable = false, length = 50)
    private String name;

    @Column(name = "WT_ID")
    private String wtId;

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

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;
}



