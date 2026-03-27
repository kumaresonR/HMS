package com.hms.services.patientmanagement.response;

import com.hms.services.patientmanagement.model.EmployeeDetails;
import com.hms.services.patientmanagement.model.PatientsDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class AppointmentsResponse {

    private String appointmentId;
    private PatientsDTO patients;
    private String doctorId;
    private Double registrationFees;
    private String paymentType;
    private String appointmentDate;
    private LocalTime appointmentTime;
    private String reasonForVisit;
    private String appointmentPriority;
    private String specialist;
    private String shift;
    private String slots;
    private String tokenNo;
    private String status;
//    private String height;
//    private String weight;
//    private String pulse;
//    private String temperature;
//    private String respiration;
//    private String bp;
    private Integer version;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalTime time;
    private Boolean isActive;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
    private EmployeeDetails doctor;
}

