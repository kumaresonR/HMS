package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TW_COMPLAINT_TYPE")
public class HMS_TW_ComplaintType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "COMPLAIN_TYPE", nullable = false, length = 255)
    private String complainType;

    @Lob
    @Column(name = "DESCRIPTION", columnDefinition = "text")
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

    @Column(name = "CREATED_BY", length = 50)
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY", length = 50)
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;

}


