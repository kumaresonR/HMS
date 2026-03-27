package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TW_FINDING")
public class HMS_TW_Finding {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "FINDING_ID")
    private String findingId;

    @Column(name = "CATEGORY_ID", nullable = false)
    private String categoryId;

    @Column(name = "FINDING", nullable = false, length = 100)
    private String finding;

    @Column(name = "DESCRIPTION", length = 1000)
    private String description;

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



