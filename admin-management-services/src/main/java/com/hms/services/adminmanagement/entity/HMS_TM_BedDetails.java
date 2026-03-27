package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_BED_DETAILS")
public class HMS_TM_BedDetails {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "BED_DETAILS_ID")
    private String bedDetailsId;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "BED_TYPE_ID", nullable = false, length = 50)
    private String bedTypeId;

    @Column(name = "BED_GROUP_ID", nullable = false, length =50)
    private String bedGroupId;

    @Column(name = "WT_ID")
    private String wtId;

    @Column(name = "NOT_AVAILABLE",length = 10)
    private boolean notAvailable = false;

    @Column(name = "MOD_NO",nullable = false,length = 10)
    private String modNo;

    @Column(name = "AUTH_STAT", nullable = false, length = 15)
    private String authStat;

    @Column(name = "RECORD_STAT", nullable = false, length = 10)
    private String recordStat;

    @Column(name = "ROOM_STATUS",length = 10)
    private boolean roomStatus=false;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;
}



