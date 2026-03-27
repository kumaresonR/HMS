package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name="HMS_TM_IPDDOSAGE", schema = "ipd")
public class HMS_TM_IPDDosage {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "DOSAGE_ID")
    private String dosageId;

    @Column(name = "MEDICATION_ID")
    private String medicationId;

    @Column(name = "DOSAGE")
    private String dosage;

    @Lob
    @Column(name = "REMARKS", columnDefinition = "text")
    private String remarks;

    @Column(name = "DOSAGE_DATE", columnDefinition = "timestamp")
    private LocalDate dosageDate;

    @Column(name = "DOSAGE_TIME", columnDefinition = "TIME")
    private LocalTime dosageTime;

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

