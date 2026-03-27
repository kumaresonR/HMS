package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommissionDTO {

    private String id;
    private String patientId;
    private String opdId;
    private String doctorId;
    private LocalDateTime dateTime;
    private String commissionCategory;
    private Double commissionPercentage;
    private Double commissionAmount;
    private Boolean isActive = true;
    private Boolean isPaid = false;
    private OPDCombinedDTO.PatientDTO patients;
    private EmployeeDetails employeeDetails;
}

