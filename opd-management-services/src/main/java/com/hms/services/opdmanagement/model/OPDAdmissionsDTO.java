package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OPDAdmissionsDTO {

    private String admissionId;
    private String patientId;
    private String opdId;
    private String doctorId;
    private String nurseId;
    private Long caseId;
    private String chargeCategoryId;
    private String chargeName;
    private String chargeCategory;
    private String chargeId;
    private String symptomsType;
    private String symptomsTitle;
    private String symptomsDescription;
    private String note;
    private String anyKnownAllergies;
    private String previousMedicalIssue;
    private LocalDateTime appointmentDate;
    private LocalDateTime dischargeDate;
    private Double creditLimit;
    private boolean casualty;
    private boolean oldPatient;
    private String reference;
    private boolean tpa;
    private Double standardCharge;
    private Double appliedCharge;
    private Double discountPercentage;
    private Double taxPercentage;
    private Double amount;
    private String paymentMode;
    private Double paidAmount;
    private boolean liveConsultation;
    private boolean antenatal;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}

