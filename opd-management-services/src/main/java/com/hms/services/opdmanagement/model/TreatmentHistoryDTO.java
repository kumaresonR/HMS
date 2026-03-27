package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TreatmentHistoryDTO {

    private String admissionId;
    private PatientsDTO patientDetails;
    private String opdId;
    private DoctorDetailsDTO doctorDetails;
    private String nurseId;
    private Long caseId;
    private String chargeCategoryId;
    private String chargeId;
    private String symptomsType;
    private String symptomsTitle;
    private String symptomsDescription;
    private String note;
    private String anyKnownAllergies;
    private String previousMedicalIssue;
    private LocalDateTime appointmentDate;
    private boolean isAntenatal;
    private Integer totalReCheckup;

    @Data
    public static class PatientsDTO {

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
        private InsuranceProvidersDTO insuranceProviders;
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

}

