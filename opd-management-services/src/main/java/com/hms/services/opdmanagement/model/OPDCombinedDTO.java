package com.hms.services.opdmanagement.model;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Data
public class OPDCombinedDTO {


    // Nested class for HMS_TM_IPDAdmissions
    @Data
    public static class OPDAdmissionsDTO {
        private String admissionId;
        private String patientId;
        private PatientDTO patientDetails;
        private String opdId;
        private String doctorId;
        private String nurseId;
        private Long caseId;
        private LocalDateTime appointmentDate;
        private String reasonForAdmission;
        private String symptomsType;
        private String symptomsTitle;
        private String symptomsDescription;
        private String note;
        private boolean tpa;
        private Double standardCharge;
        private Double appliedCharge;
        private Double discountPercentage;
        private Double taxPercentage;
        private Double amount;
        private String paymentMode;
        private Double paidAmount;
        private boolean liveConsultation;
        private boolean isActive;
        private String reference;
        private String previousMedicalIssue;
        private boolean casualty;
        private boolean oldPatient;
        private String status;
        private boolean antenatal;
        private LocalDateTime dischargeDate;
        private String dischargeStatus;
        private String dischargeSummary;
        private String operation;
        private String diagnosis;
        private String investigation;
        private String treatmentHome;
        private LocalDateTime deathDate;
        private String guardianName;
        private String report;
        private LocalDateTime referralDate;
        private String referralHospitalName;
        private String reasonForReferral;
        private String attachment;
        private Double creditLimit;
        private String knownAllergies;
        private EmployeeDetails doctor;

    }


    @Data
    public static class PatientDTO {
        private String id;
        private String patientId;
        private String firstName;
        private String lastName;
        private String dateOfBirth;
        private String gender;
        private String age;
        private String maritalStatus;
        private String contactNumber;
        private String email;
        private String address;
        private String pinCode;
        private String state;
        private String nationality;
        private String idProof;
        private String idNumber;
        private String bloodType;
        private String allergies;
        private LocalDateTime lastVisit;
        private Integer totalReCheckup;
        private String oldPrescription;
        private InsuranceProvidersDTO insuranceProviders;
        private List<EmergencyContactsDTO> emergencyContacts;
    }

    @Data
    public static class InsuranceProvidersDTO {
        private String insuranceId;
        private String providerName;
        private String policyNumber;
        private String coverageDetails;
        private String insuranceExpiryDate;
    }

    @Data
    public static class DoctorDetailsDTO {

        private String employeeId;
        private String staffId;
        private String firstName;
        private String lastName;
        private String gender;
        private String email;
        private String phone;
        private String designation;
        private String roleId;
        private String departmentId;
    }


    @Data
    public static class OPDMedicationDTO {
        private String medicationId;
        private String medicineId;
        private String opdId;
        private String medicineName;
        private String medicineCategory;
        private LocalDate date;
        private LocalDateTime createdAt;
        private String createdBy;
        private String lastModifiedBy;
        private LocalDateTime lastModifiedAt;
        private List<DosageDTO> dosage;
    }

    @Data
    public static class DosageDTO {

        private String dosageId;
        private String medicationId;
        private String dosage;
        private String remarks;
        private String createdBy;
        private LocalDate dosageDate;
        private LocalTime dosageTime;
        private boolean isActive;

    }


    @Data
    public static class OPDOperationDTO {
        private String operationId;
        private String patientId;
        private String otReferenceNo;
        private String opdId;
        private String doctorId;
        private String operationCategoryId;
        private String operationNameId;
        private String operationName;
        private String operationCategory;

        private LocalDateTime operationDate;
        private String assistantConsultant1;
        private String assistantConsultant2;
        private String anesthetist;
        private String anesthesiaType;
        private String otTechnician;
        private String otAssistant;
        private String remark;
        private String result;
        private String status;
        private String customField;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private String createdBy;
        private String lastModifiedBy;
        private LocalDateTime lastModifiedAt;
        private EmployeeDetails doctor;

    }


    // Nested class for HMS_TM_Prescriptions
    @Data
    public static class PrescriptionsDTO {
        private String prescriptionId;
        private String prescriptionNo;
        private List<String> pathologyId;
        private List<String> radiologyId;
        private String datePrescribed;
        private String findingCategory;
        private String finding;
        private String findingDescription;
        private String reportName;
        private String attachment;
        private String validUntil;
        private String prescriptionStatus;
        private LocalTime prescriptionTime;
        private EmployeeDetails doctor;
        private List<PrescriptionDetailsDTO> prescriptionDetails;
        private List<PathologyTestDetailsDTO> pathologyTestDetails;
        private List<RadiologyTestDetailsDTO> radiologyTestDetails;

    }

    // Nested class for HMS_TM_PrescriptionDetails
    @Data
    public static class PrescriptionDetailsDTO {
        private String prescriptionDetailId;
        private String prescriptionId;
        private String medicineId;
        private String opdId;
        private String medicineCategory;
        private String medicineName;
        private String dosage;
        private String dosageInterval;
        private String dosageDuration;
        private String instruction;

    }

    // Nested class for HMS_TM_IPDCharges
//    @Data
//    public static class OPDChargesDTO {
//        private String opdChargeId;
////        private String opdChargesType;
////        private String opdChargesCategory;
////        private String opdChargesName;
//        private OPDChargesTypeDTO opdChargesTypeDTO;
//        private OPDChargesCategoryDTO opdChargesCategoryDTO;
//        private OPDChargesNameDTO opdChargesNameDTO;
//        private Double standardCharge;
//        private Double tpaCharge;
//        private Float qty;
//        private Float total;
//        private Double discountAmount;
//        private Double discountPercentage;
//        private Double taxAmount;
//        private Double taxPercentage;
//        private Double netAmount;
//        private String chargeNote;
//        private LocalDateTime date;
//    }


    @Data
    public static class OPDChargesDTO {
        private String opdChargeId;
        //        private String opdChargesType;
//        private String opdChargesCategory;
//        private String opdChargesName;
//        private OPDChargesTypeDTO opdChargesTypeDTO;
//        private OPDChargesCategoryDTO opdChargesCategoryDTO;
//        private OPDChargesNameDTO opdChargesNameDTO;
        private Double standardCharge;
        private Double tpaCharge;
        private boolean applyTpa;
        private boolean isGstAdded;
        private Float qty;
        private Float total;
        private Double discountAmount;
        private Double discountPercentage;
        private Double taxAmount;
        private Double taxPercentage;
        private Double netAmount;
        private String chargeNote;
        private LocalDateTime date;
        private CombinedCharges combinedCharges;
    }
    @Data
    public static class CombinedCharges {

        private String chargeId;
        private String chargeTypeId;
        private String categoryId;
        private String unitTypeId;
        private String taxCategoryId;
        private String chargeName;
        private Double taxPercentage;
        private Double standardCharge;
        private String description;
        private String modNo;
        private String authStat;
        private String recordStat;
        private ChargeTypeDTO chargeType;
        private ChargeCategoryDTO chargeCategory;
        private UnitTypeDTO unitType;
        private TaxCategoryDTO taxCategory;
        private List<ScheduleChargeDTO> scheduleCharges;
    }

    // Nested class for HMS_TM_IPDPayments
    @Data
    public static class OPDPaymentsDTO {
        private String opdChargeId;
        private LocalDate date;
        private String transactionId;
        private Double amount;
        private String paymentMode;
        private String note;
        private String chequeNo;
        private Date chequeDate;
        private String chequeAttachment;
    }


    // Nested DTO class for Vitals
    @Data
    public static class VitalsDTO {
        private String vitalsId;
        private String ipdId;
        private LocalDateTime date;
        private String vitalName;
        private String vitalValue;
    }

    // Nested DTO class for Timeline
    @Data
    public static class TimeLineDTO {
        private String timeLineId;
        private String ipdId;
        private LocalDateTime date;
        private String description;
        private String title;
        private boolean isActive;
        private String attachment;
    }

    @Data
    public static class OPDChargesTypeDTO  {
        private String chargeTypeId;
        private String chargeType;
    }

    @Data
    public static class OPDChargesCategoryDTO  {
        private String chargeCategoryId;
        private String chargeCategory;
    }

    @Data
    public static class OPDChargesNameDTO  {
        private String chargeNameId;
        private String chargeName;
        private Double standardCharge;
        private Double tpaCharge;
        private Double taxPercentage;
    }


    // Main fields in IPDCombinedDTO
    private OPDAdmissionsDTO admissions;
    private List<PrescriptionsDTO> prescriptions;
    private List<OPDMedicationDTO> medicationsDetails;
    private List<OPDOperationDTO> opdOperationDetails;
    private List<OPDChargesDTO> opdCharges;
    private List<OPDPaymentsDTO> opdPayments;
    private List<VitalsDTO> vitals;
    private List<TimeLineDTO> timeline;
    private PatientDTO patient;
}

