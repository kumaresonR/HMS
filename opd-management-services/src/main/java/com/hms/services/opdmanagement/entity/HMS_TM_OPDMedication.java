package com.hms.services.opdmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name="HMS_TM_OPDMEDICATION")
public class HMS_TM_OPDMedication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MEDICATION_ID")
    private String medicationId;

    @Column(name = "MEDICINE_ID")
    private String medicineId;

    @Column(name = "MEDICINE_NAME")
    private String medicineName;

    @Column(name = "OPD_ID")
    private String opdId;

    @Column(name = "MEDICINE_CATEGORY")
    private String medicineCategory;

    @Column(name = "DATE", columnDefinition = "timestamp")
    private LocalDate date;

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


