package com.hms.services.patientmanagement.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class AppointmentsDetails {

    private String appointmentId;
    @NotBlank(message = "PatientInfo. cannot be blank")
    private String patientId;
    @NotBlank(message = "DoctorInfo. cannot be blank")
    private String doctorId;
    @NotBlank(message = "RegistrationFees cannot be blank")
    private Double registrationFees;
    @NotBlank(message = "PaymentType cannot be blank")
    private String paymentType;
    @NotBlank(message = "Specialist cannot be blank")
    private String specialist;
    @NotBlank(message = "Shift cannot be blank")
    private String shift;
    @NotBlank(message = "Slots cannot be blank")
    private String slots;
    @NotBlank(message = "TokenNo. cannot be blank")
    private String TokenNo;
    @NotBlank(message = "AppointmentDate cannot be blank")
    private String appointmentDate;
    @NotBlank(message = "AppointmentTime cannot be blank")
    private LocalTime appointmentTime;
    @NotBlank(message = "ReasonForVisit cannot be blank")
    private String reasonForVisit;
    @NotBlank(message = "Status cannot be blank")
    private String appointmentPriority;
    private String status;
    private Integer version;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalTime time;
    private Boolean isActive;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
    private EmployeeDetails doctor;
    private PatientsDTO patient;
}

