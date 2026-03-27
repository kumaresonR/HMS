package com.hms.services.patientmanagement.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class PrescriptionDTO {

    private String prescriptionId;
    @NotBlank(message = "PatientInfo. cannot be blank")
    private String patientId;
    @NotBlank(message = "DoctorInfo. cannot be blank")
    private String doctorId;
    @NotBlank(message = "DatePrescribed cannot be blank")
    private String datePrescribed;
    @NotBlank(message = "ValidUntil cannot be blank")
    private String validUntil;
    private String status;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalTime time;
    private Boolean isActive;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
    private List<PrescriptionDetailsDTO> PrescriptionDetails;

}

