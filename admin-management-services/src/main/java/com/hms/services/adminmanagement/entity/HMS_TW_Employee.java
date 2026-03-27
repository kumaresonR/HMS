package com.hms.services.adminmanagement.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "HMS_TW_EMPLOYEE")
public class HMS_TW_Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "EMPLOYEE_ID", updatable = false, nullable = false)
    private String employeeId;

    @Column(name = "STAFF_ID")
    private String staffId;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(name = "REPORTER_ID")
    private String reporterId;


//    @JsonIgnore
    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "GENDER")
    private String gender;

    @Column(name = "DATE_OF_BIRTH")
    private LocalDate dateOfBirth;

    @Column(name = "DATE_OF_JOINING")
    private LocalDate dateOfJoining;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "MARITAL_STATUS")
    private String maritalStatus;

    @Column(name = "DESIGNATION")
    private String designation;

    @Column(name = "ROLE_ID")
    private String roleId;

    @Column(name = "ROLE")
    private String role;

    @Column(name = "DOCTOR_FEE")
    private String doctorFee;

    @Lob
    @Column(name = "PHOTO", columnDefinition = "text")
    private String photo;

    @Column(name = "DEPARTMENT_ID")
    private String departmentId;

    @Column(name = "FATHER_NAME")
    private String fatherName;

    @Column(name = "MOTHER_NAME")
    private String motherName;

    @Column(name = "BLOOD_GROUP")
    private String bloodGroup;

    @Column(name = "NATIONAL_ID_NUMBER")
    private String nationalIdNumber;

    @Column(name = "PAN_NUMBER")
    private String panNumber;

    @Column(name = "LOCAL_ID_NUMBER")
    private String localIdNumber;

    @Column(name = "SPECIALIST")
    private String specialist;

    @Column(name = "REFERENCE_CONTACT")
    private String referenceContact;

    @Column(name = "QUALIFICATION")
    private String qualification;

    @Lob
    @Column(name = "CURRENT_ADDRESS", columnDefinition = "text")
    private String currentAddress;

    @Lob
    @Column(name = "PERMANENT_ADDRESS", columnDefinition = "text")
    private String permanentAddress;

    @Column(name = "WORK_EXPERIENCE")
    private String workExperience;

    @Column(name = "SPECIALIZATION")
    private String specialization;

    @Column(name = "NOTE")
    private String note;

    // Payroll Information
    @Column(name = "EPF_NUMBER")
    private String epfNumber;

    @Column(name = "BASIC_SALARY")
    private double basicSalary;

    @Column(name = "CONTRACT_TYPE")
    private String contractType;

    @Column(name = "WORK_SHIFT")
    private String workShift;

    @Column(name = "WORK_LOCATION")
    private String workLocation;

    // Leave Details
    @Column(name = "CASUAL_LEAVE")
    private int casualLeave;

    @Column(name = "PRIVILEGE_LEAVE")
    private int privilegeLeave;

    @Column(name = "SICK_LEAVE")
    private int sickLeave;

    @Column(name = "MATERNITY_LEAVE")
    private int maternityLeave;

    @Column(name = "PATERNITY_LEAVE")
    private int paternityLeave;

    @Column(name = "FEVER_LEAVE")
    private int feverLeave;

    @Column(name = "LOP")
    private int lop = 0;

    // Bank Account Information
    @Column(name = "ACCOUNT_TITLE")
    private String accountTitle;

    @Column(name = "BANK_ACCOUNT_NO")
    private String bankAccountNo;

    @Column(name = "BANK_NAME")
    private String bankName;

    @Column(name = "IFSC_CODE")
    private String ifscCode;

    @Column(name = "BANK_BRANCH_NAME")
    private String bankBranchName;

    // Social Media Links
    @Column(name = "FACEBOOK_URL")
    private String facebookUrl;

    @Column(name = "TWITTER_URL")
    private String twitterUrl;

    @Column(name = "LINKEDIN_URL")
    private String linkedinUrl;

    @Column(name = "INSTAGRAM_URL")
    private String instagramUrl;

    // Document Uploads
    @Lob
    @Column(name = "RESUME", columnDefinition = "text")
    private String resume;

    @Lob
    @Column(name = "JOINING_LETTER", columnDefinition = "text")
    private String joiningLetter;

    @Lob
    @Column(name = "RESIGNATION_LETTER", columnDefinition = "text")
    private String resignationLetter;

    @Lob
    @Column(name = "OTHER_DOCUMENTS", columnDefinition = "text")
    private String otherDocuments;

    @Column(name = "AUTH_STAT")
    private String authStat = "UNAUTHORIZED";

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo= "V1";

    @Column(name = "EXITED")
    private Boolean exited = false;
}




