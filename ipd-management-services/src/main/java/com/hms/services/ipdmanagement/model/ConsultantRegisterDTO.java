package com.hms.services.ipdmanagement.model;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ConsultantRegisterDTO {

    private String consultantRegisterId;
    private String doctorId;
    private String patientId;
    private String ipdId;
    private LocalDate appliedDate;
    private String instruction;
    private LocalDate consultantDate;
    private String consultantDoctor;
    private EmployeeDetails doctor;


}

