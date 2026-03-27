package com.hms.services.patientmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="HMS_TM_PRESCRIPTIONDETAILS")
public class HMS_TM_PrescriptionDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PRESCRIPTION_DETAIL_ID")
    private String prescriptionDetailId;

    @Column(name = "PRESCRIPTION_ID")
    private String prescriptionId;

    @Column(name = "MEDICINE_ID")
    private String medicineId;

    @Column(name = "DOSAGE")
    private String dosage;

    @Column(name = "ROUTE")
    private String route;

    @Column(name = "UOM")
    private Integer uom;

    @Column(name = "FREQUENCY")
    private String frequency;

    @Column(name = "DURATION")
    private String duration;

    @Column(name = "INTAKE")
    private String intake;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

}


