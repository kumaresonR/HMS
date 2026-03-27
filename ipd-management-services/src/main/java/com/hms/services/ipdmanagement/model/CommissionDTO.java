package com.hms.services.ipdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommissionDTO {

    private String id;
    private String patientId;
    private String ipdId;
    private String doctorId;
    private LocalDateTime dateTime;
    private String commissionCategory;
    private Double commissionPercentage;
    private Double commissionAmount;
    private Boolean isActive = true;
    private Boolean isPaid = false;
    private IPDCombinedDTO.PatientDTO patients;
    private EmployeeDetails employeeDetails;
}

