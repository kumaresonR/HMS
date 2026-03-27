package com.hms.services.ipdmanagement.model;


import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class PrescriptionDetailsDTO {

    private String prescriptionDetailId;
    private String prescriptionId;
    private String medicineId;
    private String ipdId;
    private String medicineCategory;
    private String medicineName;
    private String dosage;
    private String dosageInterval;
    private String dosageDuration;
    private String instruction;
    private boolean isActive;
}
