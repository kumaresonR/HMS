package com.hms.services.opdmanagement.model;


import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class MedicationDTO {

    private String medicationId;
    private String medicineId;
    private String medicineName;
    private String opdId;
    private String medicineCategory;
    private LocalDate date;
    private boolean isActive;
    private List<DosageDTO> dosage;


}

