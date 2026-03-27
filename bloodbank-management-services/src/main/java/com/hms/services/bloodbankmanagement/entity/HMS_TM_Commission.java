package com.hms.services.bloodbankmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_COMMISSION")
public class HMS_TM_Commission {

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "PATIENT_ID", length = 255)
    private String patientId;

    @Column(name = "IPD_OR_OPD_ID")
    private String ipdOrOpdId;

    @Column(name = "DOCTOR_ID", length = 100)
    private String doctorId;

    @Column(name = "DATE_TIME")
    private LocalDateTime dateTime;

    @Column(name = "COMMISSION_CATEGORY", length = 100)
    private String commissionCategory;

    @Column(name = "COMMISSION_PERCENTAGE")
    private Double commissionPercentage;

    @Column(name = "COMMISSION_AMOUNT")
    private Double commissionAmount;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive = true;

    @Column(name = "IS_PAID")
    private Boolean isPaid = false;






}


