package com.hms.services.patientmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name="HMS_TM_PRESCRIPTIONS")
public class HMS_TM_Prescriptions {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PRESCRIPTION_ID", updatable = false, nullable = false)
    private String prescriptionId;

    @Column(name = "PATIENT_ID")
    private String patientId;

    @Column(name = "DOCTOR_ID")
    private String doctorId;

    @Column(name = "DATE_PRESCRIBED")
    private String datePrescribed;

    @Column(name = "VALID_UNTIL")
    private String validUntil;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "TIME")
    private LocalTime time;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;
}

