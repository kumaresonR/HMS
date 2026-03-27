package com.hms.services.ipdmanagement.model;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Data
public class IPDCombinedDTO {

    @Data
    public static class PatientDTO {
        private String id;
        private String patientId;
        private String firstName;
        private String lastName;
        private String dateOfBirth;
        private String gender;
        private String age;
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
        private String oldPrescription;
        private InsuranceProvidersDTO insuranceProviders;
        private List<EmergencyContactsDTO> emergencyContacts;

    }

    @Data
    public static class IPDAdmissionsDTO {
        private String admissionId;
        private String patientId;
        private String ipdId;
        private String doctorId;
        private String nurseId;
        private Long caseId;
        private LocalDateTime admissionDate;
        private String roomId;
        private String reasonForAdmission;
        private String symptomsType;
        private String symptomsTitle;
        private String symptomsDescription;
        private String note;
        private String tpa;
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
        private TPADetailsDTO insurance;
    }

    @Data
    public static class NurseNotesDTO {
        private String notesId;
        private String ipdId;
        private String nurseId;
        private LocalDateTime date;
        private String noteType;
        private String note;
        private String createdBy;
        private String lastModifiedBy;
        private LocalDateTime createdAt;
        private List<CommentsDTO> comments;
        private EmployeeDetails doctor;

    }

    @Data
    public static class CommentsDTO {

        private String commentId;
        private String comment;
        private LocalDateTime createdAt;
        private String createdBy;
        private String lastModifiedBy;
        private LocalDateTime lastModifiedAt;

    }

    @Data
    public static class IPDMedicationDTO {
        private String medicationId;
        private String medicineId;
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
        private LocalTime dosageTime;
        private boolean isActive;

    }


    // Nested class for HMS_TM_Prescriptions
    @Data
    public static class PrescriptionsDTO {
        private String prescriptionId;
        private String prescriptionNo;
        private List<String> pathologyId;
        private List<String> radiologyId;
        private String doctorId;
        private String headerNote;
        private String footerNote;
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
        private String medicineId;
        private String ipdId;
        private String medicineCategory;
        private String medicineName;
        private String dosage;
        private String dosageInterval;
        private String dosageDuration;
        private String instruction;
    }

    // Nested class for HMS_TM_ConsultantRegister
    @Data
    public static class ConsultantRegisterDTO {
        private String consultantId;
        private LocalDate appliedDate;
        private String instruction;
        private LocalDate consultantDate;
        private String consultantDoctor;
        private EmployeeDetails doctor;
    }

    // Nested class for HMS_TM_IPDCharges
//    @Data
//    public static class IPDChargesDTO {
//        private String ipdChargeId;
//        private IPDChargesTypeDTO ipdChargesTypeDTO;
//        private IPDChargesCategoryDTO ipdChargesCategoryDTO;
//        private IPDChargesNameDTO ipdChargesNameDTO;
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
//        private EmployeeDetails doctor;
//    }

    @Data
    public static class IPDChargesDTO {
        private String ipdChargeId;
        //        private IPDChargesTypeDTO ipdChargesTypeDTO;
//        private IPDChargesCategoryDTO ipdChargesCategoryDTO;
//        private IPDChargesNameDTO ipdChargesNameDTO;
        private Double standardCharge;
        private Double tpaCharge;
        private boolean isTpa;
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
        private EmployeeDetails doctor;
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
    public static class IPDPaymentsDTO {
        private String ipdPaymentId;
        private LocalDate date;
        private String transactionId;
        private Double amount;
        private String paymentMode;
        private String chequeNo;
        private Date chequeDate;
        private String chequeAttachment;
        private String note;
    }

    @Data
    public static class BedDetailsDTO {
        private String bedDetailsId;
        private String name;
        private BedGroupDTO bedGroup;
        private BedTypeDTO bedType;

    }

    // Nested class for HMS_TM_BedGroup
    @Data
    public static class BedGroupDTO {
        private String bedGroupId;
        private String name;
        private String description;
        private FloorDTO floor;
    }

    @Data
    public static class FloorDTO {
        private String floorId;
        private String floorName;
        private String floorDescription;
    }


    @Data
    public static class BedTypeDTO {
        private String bedTypeId;
        private String name;
    }

    // Nested DTO class for Vitals
    @Data
    public static class VitalsDTO {
        private String vitalsId;
        private String ipdId;
        private Date date;
        private String vitalName;
        private String vitalValue;
    }


    @Data
    public static class IPDOperationDTO {
        private String operationId;
        private String patientId;
        private String otReferenceNo;
        private String ipdId;
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
    public static class IPDChargesTypeDTO  {
        private String chargeTypeId;
        private String chargeType;
    }

    @Data
    public static class IPDChargesCategoryDTO  {
        private String chargeCategoryId;
        private String chargeCategory;
    }

    @Data
    public static class IPDChargesNameDTO  {
        private String chargeNameId;
        private String chargeName;
        private Double standardCharge;
        private Double tpaCharge;
        private Double taxPercentage;
    }

    @Data
    public static class PreviousObstetricHistoryDTO {

        private String historyId;
        private String ipdId;
        private String placeOfDelivery;
        private String durationOfPregnancy;
        private String complicationsInPregnancyOrPuerperium;
        private Double birthWeight;
        private String gender;
        private String infantFeeding;
        private String birthStatus;
        private String aliveStatus;
        private String deathCause;
        private Date aliveOrDeadDate;
        private String previousMedicalHistory;
        private String specialInstruction;
    }

    @Data
    public static class PostnatalHistoryDTO {

        private String postnatalId;
        private String ipdId;
        private LocalDateTime laborTime;
        private LocalDateTime deliveryTime;
        private String routineQuestion;
        private String generalRemark;
        private boolean isActive;
        private LocalDateTime createdAt;
        private String createdBy;
        private String lastModifiedBy;
        private LocalDateTime lastModifiedAt;

    }

    @Data
    public static class AntenatalFindingDTO {

        private String antenatalId;
        private String ipdId;
        private String bleeding;
        private String headache;
        private String pain;
        private String constipation;
        private String urinarySymptoms;
        private String vomiting;
        private String cough;
        private String vaginal;
        private String discharge;
        private String height;
        private String oedema;
        private String haemoroids;
        private Double weight;
        private Date date;
        private String condition;
        private String specialFindingsAndRemark;
        private String pelvicExamination;
        private String sp;
        private String antenatalExamination;
        private String uterSize;
        private String uterusSize;
        private String presentationPosition;
        private String presentingPartToBrim;
        private String foetalHeart;
        private String bloodPressure;
        private String antenatalOedema;
        private String urineSugar;
        private String urineAlbumen;
        private Double antenatalWeight;
        private String remark;
        private Date nextVisit;
        private String previousAntenatalDetails;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private String createdBy;
        private String lastModifiedBy;
        private LocalDateTime lastModifiedAt;
    }

    // Main fields in IPDCombinedDTO
    private IPDAdmissionsDTO admissions;
    private List<NurseNotesDTO> nurseNotes;
    private List<PrescriptionsDTO> prescriptions;
    private List<IPDMedicationDTO>medication;
    private List<ConsultantRegisterDTO> consultantRegister;
    private List<IPDChargesDTO> ipdCharges;
    private List<IPDPaymentsDTO> ipdPayments;
    private List<IPDOperationDTO> operation;
    private BedDetailsDTO bedDetails;
    private List<VitalsDTO> vitals;
    private List<TimeLineDTO> timeline;
    private List<PreviousObstetricHistoryDTO> previousObstetricHistory;
    private List<PostnatalHistoryDTO>postnatalHistory;
    private List<AntenatalFindingDTO> antenatalFindings;
    private PatientDTO patient;
}

