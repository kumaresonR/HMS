package com.hms.services.patientmanagement.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name="HMS_TM_APPOINTMENTS")
public class HMS_TM_Appointments {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "APPOINTMENT_ID")
    private String appointmentId;

    @Column(name = "PATIENT_ID")
    private String patientId;

    @Column(name = "DOCTOR_ID")
    private String doctorId;

    @Column(name = "REGISTRATION_FEES")
    private Double registrationFees;

    @Column(name = "PAYMENT_TYPE")
    private String paymentType;

    @Column(name = "SPECIALIST")
    private String specialist;

    @Column(name = "SHIFT")
    private String shift;

    @Column(name = "SLOTS")
    private String slots;

    @Column(name = "TOKEN_No.")
    private String TokenNo;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @Column(name = "APPOINTMENT_DATE")
    private String appointmentDate;

    @Column(name = "APPOINTMENT_TIME")
    private LocalTime appointmentTime;

    @Column(name = "REASON_FOR_VISIT")
    private String reasonForVisit;

    @Column(name = "APPOINTMENT_PRIORITY")
    private String appointmentPriority;

//    @Column(name = "HEIGHT", length = 100)
//    private String height;
//
//    @Column(name = "WEIGHT", length = 100)
//    private String weight;
//
//    @Column(name = "PULSE", length = 100)
//    private String pulse;
//
//    @Column(name = "TEMPERATURE", length = 100)
//    private String temperature;
//
//    @Column(name = "RESPIRATION", length = 100)
//    private String respiration;
//
//    @Column(name = "BP", length = 100)
//    private String bp;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "VERSION")
    private Integer version;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "TIME")
    private LocalTime time;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;


}

