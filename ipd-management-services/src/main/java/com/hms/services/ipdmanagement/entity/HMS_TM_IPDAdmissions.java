package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name="HMS_TM_IPDADMISSIONS", schema = "ipd")
public class HMS_TM_IPDAdmissions {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ADMISSION_ID")
    private String admissionId;

    @Column(name = "PATIENT_ID")
    private String patientId;

    @Column(name = "IPD_ID", nullable = false)
    private String ipdId;

    @Column(name = "DOCTOR_ID")
    private String doctorId;

    @Column(name = "NURSE_ID")
    private String nurseId;

    @Column(name = "CASE_ID")
    private Long caseId;

    @Column(name = "ADMISSION_DATE", columnDefinition = "timestamp")
    private LocalDateTime admissionDate;
//
//    @Column(name = "ADMISSION_TIME", columnDefinition = "TIME")
//    private LocalTime admissionTime;

    @Column(name = "ROOM_ID")
    private String roomId;

    @Column(name = "REASON_FOR_ADMISSION",length = 1000)
    private String reasonForAdmission;

    @Column(name = "SYMPTOMS_TYPE")
    private String symptomsType;

    @Column(name = "SYMPTOMS_TITLE")
    private String symptomsTitle;

    @Column(name = "SYMPTOMS_DESCRIPTION", length = 2000)
    private String  symptomsDescription;

    @Column(name = "NOTE",length = 2000)
    private String  note;

    @Column(name = "TPA")
    private String  tpa;

    @Column(name = "REFERENCE")
    private String  reference;

    @Column(name = "PREVIOUS MEDICAL ISSUE",length = 2000)
    private String  previousMedicalIssue;

    @Column(name = "CASUALTY")
    private boolean  casualty;

    @Column(name = "OLDPATIENT")
    private boolean oldPatient;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "ANTENATAL")
    private boolean antenatal;

    @Column(name = "DISCHARGE_DATE", columnDefinition = "timestamp")
    private LocalDateTime dischargeDate;

    @Column(name = "DISCHARGE_STATUS")
    private String dischargeStatus;

    @Lob
    @Column(name = "DISCHARGE_SUMMARY", columnDefinition = "text")
    private String dischargeSummary;

    @Column(name = "OPERATION")
    private String operation;

    @Column(name = "DIAGNOSIS")
    private String diagnosis;

    @Column(name = "INVESTIGATION")
    private String investigation;

    @Column(name = "TREATMENT_HOME")
    private String treatmentHome;

    @Column(name = "DEATH_DATE", columnDefinition = "timestamp")
    private LocalDateTime deathDate;

    @Column(name = "GUARDIAN_NAME")
    private String guardianName;

    @Column(name = "REPORT")
    private String report;

    @Column(name = "REFERRAL_DATE")
    private LocalDateTime referralDate;

    @Column(name = "REFERRAL_HOSPITAL_NAME")
    private String referralHospitalName;

    @Column(name = "REASON_FOR_REFERRAL")
    private String reasonForReferral;

    @Lob
    @Column(name = "ATTACHMENT", columnDefinition = "text")
    private String attachment;

    @Column(name = "CREDIT_LIMIT")
    private Double creditLimit;

    @Column(name = "KNOWN_ALLERGIES", length = 200)
    private String knownAllergies;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;

}

