package com.hms.services.opdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name="HMS_TM_OPDADMISSIONS")
public class HMS_TM_OPDAdmissions {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ADMISSION_ID")
    private String admissionId;

    @Column(name = "PATIENT_ID")
    private String patientId;

    @Column(name = "OPD_ID", nullable = false)
    private String opdId;

    @Column(name = "DOCTOR_ID")
    private String doctorId;

    @Column(name = "NURSE_ID")
    private String nurseId;

    @Column(name = "CASE_ID")
    private Long caseId;

    @Column(name = "CHARGE_CATEGORY_ID")
    private String chargeCategoryId;

    @Column(name = "CHARGE_CATEGORY")
    private String chargeCategory;

    @Column(name = "CHARGE_NAME")
    private String chargeName;

    @Column(name = "CHARGE_ID")
    private String chargeId;

    @Column(name = "SYMPTOMS_TYPE")
    private String symptomsType;

    @Column(name = "SYMPTOMS_TITLE")
    private String symptomsTitle;

    @Column(name = "SYMPTOMS_DESCRIPTION",length =2000)
    private String  symptomsDescription;

    @Column(name = "NOTE")
    private String  note;

    @Column(name = "KNOWN_ALLERGIES", length = 2000)
    private String anyKnownAllergies;

    @Column(name = "PREVIOUS MEDICAL ISSUE",length = 2000)
    private String  previousMedicalIssue;

    @Column(name = "ADMISSION_DATE", columnDefinition = "timestamp")
    private LocalDateTime appointmentDate;

    @Column(name = "CREDIT_LIMIT")
    private Double creditLimit;

    @Column(name = "CASUALTY")
    private boolean  casualty;

    @Column(name = "OLDPATIENT")
    private boolean oldPatient;

    @Column(name = "REFERENCE")
    private String  reference;

    @Column(name = "TPA")
    private boolean tpa=false;

    @Column(name = "STANDARD_CHARGE")
    private Double standardCharge;

    @Column(name = "APPLIED_CHARGE")
    private Double appliedCharge;

    @Column(name = "DISCOUNT_PERCENTAGE")
    private Double discountPercentage;

    @Column(name = "TAX_PERCENTAGE")
    private Double taxPercentage;

    @Column(name = "AMOUNT")
    private Double amount;

    @Column(name = "PAYMENT_MODE")
    private String paymentMode;

    @Column(name = "PAID_AMOUNT")
    private Double paidAmount;

    @Column(name = "LIVE_CONSULTATION")
    private boolean  liveConsultation;

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

    @Lob
    @Column(name = "REPORT", columnDefinition = "text")
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

