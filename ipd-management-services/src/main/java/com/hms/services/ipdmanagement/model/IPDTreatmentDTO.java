package com.hms.services.ipdmanagement.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class IPDTreatmentDTO {

    private String treatmentId;
    private String admissionId;
    private String doctorId;
    private LocalDate treatmentDate;
    private String treatmentType;
    private String description;
    private String notes;
    private boolean isActive;
    private String status;
    private String createdBy;
    private String lastModifiedBy;
}

