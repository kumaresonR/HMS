package com.hms.services.opdmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name="HMS_TM_OPDPRESCRIPTIONDETAILS")
public class HMS_TM_OPDPrescriptionDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PRESCRIPTION_DETAIL_ID")
    private String prescriptionDetailId;

    @Column(name = "PRESCRIPTION_ID")
    private String prescriptionId;

    @Column(name = "MEDICINE_ID")
    private String medicineId;

    @Column(name = "OPD_ID")
    private String opdId;

//    @Column(name = "DOSAGE_DATE", columnDefinition = "TIMESTAMP")
//    private LocalDate dosageDate;
//
//    @Column(name = "DOSAGE_TIME", columnDefinition = "TIME")
//    private LocalTime dosageTime;

    @Column(name = "MEDICINE_CATEGORY")
    private String medicineCategory;

    @Column(name = "MEDICINE_NAME")
    private String medicineName;

    @Column(name = "DOSAGE")
    private String dosage;

    @Column(name = "DOSAGE_INTERVAL")
    private String dosageInterval;

    @Column(name = "DOSAGE_DURATION")
    private String dosageDuration;

    @Lob
    @Column(name = "INSTRUCTION", columnDefinition = "text")
    private String instruction;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

}


