package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "HMS_TM_Medication", schema = "ipd")
public class HMS_TM_Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "BILLING_ID")
    private String billingId;

    @Column(name = "PRESCRIPTION_ID", nullable = false)
    private String prescriptionId;

    @Column(name = "MEDICINE_ID")
    private String medicineId;

    @Column(name = "IPD_ID")
    private String ipdId;

//    @Column(name = "MEDICINE_NAME", nullable = false)
//    private String medicineCategory;
//
//    @Column(name = "MEDICINE_NAME", nullable = false)
//    private String medicineName;

    @Column(name = "DOSAGE", nullable = false)
    private String dosage;

    @Column(name = "DATE", columnDefinition = "timestamp", nullable = false)
    private LocalDate date;

    @Column(name = "TIME", columnDefinition = "TIME")
    private LocalTime time;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;



}

