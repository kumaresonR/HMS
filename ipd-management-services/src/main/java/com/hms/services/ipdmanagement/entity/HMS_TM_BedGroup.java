package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Entity
@Table(name="HMS_TM_BEDGROUP", schema = "ipd")
public class HMS_TM_BedGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "BED_GROUP_ID")
    private String bedGroupId;

    @Column(name = "BED_GROUP_NAME", nullable = false,length = 50)
    private String bedGroupName;

    @Column(name = "STATUS", nullable = false, length = 20)
    private String status;

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

