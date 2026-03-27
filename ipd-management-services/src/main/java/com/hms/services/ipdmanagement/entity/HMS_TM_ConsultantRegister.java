package com.hms.services.ipdmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_CONSULTANT_REGISTER", schema = "ipd")
public class HMS_TM_ConsultantRegister {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CONSULTANT_ID", updatable = false, nullable = false)
    private String consultantId;

    @Column(name = "DOCTOR_ID")
    private String doctorId;

    @Column(name = "PATIENT_ID")
    private String patientId;

    @Column(name = "IPD_ID")
    private String ipdId;

    @Column(name = "APPLIED_DATE", nullable = false,columnDefinition = "timestamp")
    private LocalDate appliedDate;

    @Lob
    @Column(name = "INSTRUCTION", columnDefinition = "text")
    private String instruction;

    @Column(name = "CONSULTANT_DATE", nullable = false, columnDefinition = "timestamp")
    private LocalDate consultantDate;

    @Column(name = "CONSULTANT_DOCTOR")
    private String consultantDoctor;

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

