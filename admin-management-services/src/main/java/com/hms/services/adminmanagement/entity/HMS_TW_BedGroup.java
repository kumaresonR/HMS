package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TW_BEDGROUP")
public class HMS_TW_BedGroup {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "BED_GROUP_ID")
    private String bedGroupId;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "FLOOR_ID", nullable = false, length = 50)
    private String floorId;

    @Column(name = "DESCRIPTION", length = 1000)
    private String description;

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



