package com.hms.services.patientmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;

@Data
@Entity
@Table(name="HMS_TM_PATIENTS")
public class HMS_TM_Patients {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "PATIENT_ID")
    private String patientId;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(name = "DATE_OF_BIRTH")
    private String dateOfBirth;

    @Column(name = "GENDER")
    private String gender;

    @Column(name = "AGE")
    private String age;

    @Column(name = "CONTACT_NUMBER")
    private String contactNumber;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "ID_PROOF")
    private String idProof;

    @Column(name = "ID_NUMBER")
    private String idNumber;

    @Column(name = "BLOOD_TYPE")
    private String bloodType;

    @Column(name = "ALLERGIES")
    private String allergies;

    @Column(name = "PINCODE")
    private String pinCode;

    @Column(name = "STATE")
    private String state;

    @Column(name = "NATIONALITY")
    private String nationality;

    @Column(name = "INSURANCE_ID")
    private String insuranceId;

    @Column(name = "VERSION")
    private Integer version;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "DATE")
    private Date date;

    @Column(name = "TIME")
    private LocalTime time;

    @Lob
    @Column(name = "OLD_PRESCRIPTION", columnDefinition = "text")
    private String oldPrescription;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;
}

