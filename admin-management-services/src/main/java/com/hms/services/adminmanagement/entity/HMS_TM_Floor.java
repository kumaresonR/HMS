package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_FLOOR")
public class HMS_TM_Floor {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "FLOOR_ID")
    private String floorId;

    @Column(name = "FLOOR_NAME", nullable = false, length = 50)
    private String floorName;

    @Column(name = "ROOM_COUNT", nullable = false)
    private int roomCount;

    @Column(name = "DESCRIPTION", length = 1000)
    private String description;

    @Column(name = "WT_ID")
    private String wtId;

//    @Column(name = "STATUS", nullable = false, length = 20)
//    private String status;
    @Column(name = "MOD_NO",nullable = false,length = 10)
    private String modNo;

    @Column(name = "AUTH_STAT",nullable = false, length = 15)
    private String authStat;

    @Column(name = "RECORD_STAT",nullable = false,length = 10)
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



