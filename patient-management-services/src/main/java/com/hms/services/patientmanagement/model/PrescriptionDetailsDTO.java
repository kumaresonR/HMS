package com.hms.services.patientmanagement.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PrescriptionDetailsDTO {

    private String prescriptionDetailId;
    @NotBlank(message = "PrescriptionInfo. cannot be blank")
    private String prescriptionId;
    @NotBlank(message = "MedicineInfo. cannot be blank")
    private String medicineId;
    @NotBlank(message = "Dosage. cannot be blank")
    private String dosage;
    @NotBlank(message = "Route. cannot be blank")
    private String route;
    @NotBlank(message = "UnitOfMedicine cannot be blank")
    private Integer uom;
    @NotBlank(message = "Frequency cannot be blank")
    private String frequency;
    @NotBlank(message = "Duration cannot be blank")
    private String duration;
    @NotBlank(message = "Intake cannot be blank")
    private String intake;
    private Boolean isActive;

}

