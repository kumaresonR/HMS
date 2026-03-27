package com.hms.services.ipdmanagement.model;


import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class MedicationDTO {

    private String medicationId;
    private String medicineId;
    private String medicineName;
    private String ipdId;
    private LocalDate date;
    private String medicineCategory;
    private boolean isActive;
    private List<DosageDTO> dosage;


}

