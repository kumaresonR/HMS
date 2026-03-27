package com.hms.services.opdmanagement.model;


import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class OPDPrescriptionDetailsDTO {

    private String prescriptionDetailId;
    private String prescriptionId;
    private String medicineId;
    private String opdId;
    private String medicineCategory;
    private String medicineName;
    private String dosage;
    private String dosageInterval;
    private String dosageDuration;
    private String instruction;
    private boolean isActive;

}

