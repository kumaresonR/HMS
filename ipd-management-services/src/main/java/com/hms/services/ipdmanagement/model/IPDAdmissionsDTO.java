package com.hms.services.ipdmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class IPDAdmissionsDTO {

    private String admissionId;
    private String patientId;
    private String doctorId;
    private String nurseId;
    private Long caseId;
    private String ipdId;
    private LocalDateTime admissionDate;
   // private LocalTime admissionTime;
    private String roomId;
    private String reasonForAdmission;
    private String symptomsType;
    private String symptomsTitle;
    private String symptomsDescription;
    private String note;
    private String  tpa;
    private String previousMedicalIssue;
    private boolean casualty;
    private boolean oldPatient;
    private String reference;
    private String status;
    private boolean antenatal;
    private String dischargeStatus;
    private String dischargeSummary;
    private String operation;
    private String diagnosis;
    private String investigation;
    private String treatmentHome;
    private LocalDateTime dischargeDate;
    private LocalDateTime deathDate;
    private String guardianName;
    private String report;
    private LocalDateTime referralDate;
    private String referralHospitalName;
    private String reasonForReferral;
    private String attachment;
    private Double creditLimit;
    private String knownAllergies;
    private boolean isActive;
    private String createdBy;
    private String lastModifiedBy;

}

