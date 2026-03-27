package com.hms.services.adminmanagement.model;

import com.hms.services.adminmanagement.entity.HMS_TM_Employee;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeDTO {

    private String employeeId;
    private String staffId;
    private String firstName;
    private String lastName;
    private String gender;
    private String reporterId;
    private LocalDate dateOfBirth;
    private LocalDate dateOfJoining;
    private String email;
    private String phone;
    private String maritalStatus;
    private String designation;
    private String roleId;
    private String doctorFee;
    private String photo;
    private String departmentId;
    private String departmentName;
    private String fatherName;
    private String motherName;
    private String bloodGroup;
    private String nationalIdNumber;
    private String panNumber;
    private String localIdNumber;
    private String specialist;
    private String referenceContact;
    private String qualification;
    private String currentAddress;
    private String permanentAddress;
    private String workExperience;
    private String specialization;
    private String note;

    // Payroll Information
    private String epfNumber;
    private double basicSalary;
    private String contractType;
    private String workShift;
    private String workLocation;

    // Leave Details
    private int casualLeave;
    private int privilegeLeave;
    private int sickLeave;
    private int maternityLeave;
    private int paternityLeave;
    private int feverLeave;
    private int lop;

    // Bank Account Information
    private String accountTitle;
    private String bankAccountNo;
    private String bankName;
    private String ifscCode;
    private String bankBranchName;

    // Social Media Links
    private String facebookUrl;
    private String twitterUrl;
    private String linkedinUrl;
    private String instagramUrl;

    // Document Uploads
    private String resume;
    private String joiningLetter;
    private String resignationLetter;
    private String otherDocuments;

    private Boolean exited;
    private String authStat;
    private String recordStat;
    private String modNo;

    // Role Details
    private RolesDTO roleDetails;

    public EmployeeDTO(HMS_TM_Employee employee, RolesDTO roleDetails) {
        this.employeeId = employee.getEmployeeId();
        this.staffId = employee.getStaffId();
        this.reporterId = employee.getReporterId();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.gender = employee.getGender();
        this.dateOfBirth = employee.getDateOfBirth();
        this.dateOfJoining = employee.getDateOfJoining();
        this.email = employee.getEmail();
        this.phone = employee.getPhone();
        this.maritalStatus = employee.getMaritalStatus();
        this.designation = employee.getDesignation();
        this.roleId = employee.getRoleId();
        this.doctorFee = employee.getDoctorFee();
        this.photo = employee.getPhoto();
        this.departmentId = employee.getDepartmentId();
        this.fatherName = employee.getFatherName();
        this.motherName = employee.getMotherName();
        this.bloodGroup = employee.getBloodGroup();
        this.nationalIdNumber = employee.getNationalIdNumber();
        this.panNumber = employee.getPanNumber();
        this.localIdNumber = employee.getLocalIdNumber();
        this.specialist = employee.getSpecialist();
        this.referenceContact =employee.getReferenceContact();
        this.qualification = employee.getQualification();
        this.currentAddress = employee.getCurrentAddress();
        this.permanentAddress = employee.getPermanentAddress();
        this.workExperience = employee.getWorkExperience();
        this.specialization = employee.getSpecialization();
        this.note = employee.getNote();

        // Payroll Information
        this.epfNumber = employee.getEpfNumber();
        this.basicSalary = employee.getBasicSalary();
        this.contractType = employee.getContractType();
        this.workShift = employee.getWorkShift();
        this.workLocation = employee.getWorkLocation();

        // Leave Details
        this.casualLeave = employee.getCasualLeave();
        this.privilegeLeave = employee.getPrivilegeLeave();
        this.sickLeave = employee.getSickLeave();
        this.maternityLeave = employee.getMaternityLeave();
        this.paternityLeave = employee.getPaternityLeave();
        this.feverLeave = employee.getFeverLeave();

        // Bank Account Information
        this.accountTitle = employee.getAccountTitle();
        this.bankAccountNo = employee.getBankAccountNo();
        this.bankName = employee.getBankName();
        this.ifscCode = employee.getIfscCode();
        this.bankBranchName = employee.getBankBranchName();

        // Social Media Links
        this.facebookUrl = employee.getFacebookUrl();
        this.twitterUrl = employee.getTwitterUrl();
        this.linkedinUrl = employee.getLinkedinUrl();
        this.instagramUrl = employee.getInstagramUrl();

        // Document Uploads
        this.resume = employee.getResume();
        this.joiningLetter = employee.getJoiningLetter();
        this.resignationLetter = employee.getResignationLetter();
        this.otherDocuments = employee.getOtherDocuments();

        this.authStat = employee.getAuthStat();
        this.recordStat = employee.getRecordStat();
        this.modNo = employee.getModNo();

        // Role Details
        this.roleDetails = roleDetails;
    }

    public EmployeeDTO(EmployeeMinimalDTO minimalDTO, RolesDTO roleDetails) {
        this.employeeId = minimalDTO.getEmployeeId();
        this.staffId = minimalDTO.getStaffId();
        this.firstName = minimalDTO.getFirstName();
        this.lastName = minimalDTO.getLastName();
        this.gender = minimalDTO.getGender();
        this.reporterId = minimalDTO.getReporterId();
        this.dateOfBirth = minimalDTO.getDateOfBirth();
        this.dateOfJoining = minimalDTO.getDateOfJoining();
        this.email = minimalDTO.getEmail();
        this.phone = minimalDTO.getPhone();
        this.maritalStatus = minimalDTO.getMaritalStatus();
        this.designation = minimalDTO.getDesignation();
        this.roleId = minimalDTO.getRoleId();
        this.doctorFee = minimalDTO.getDoctorFee();
        this.departmentId = minimalDTO.getDepartmentId();
        this.fatherName = minimalDTO.getFatherName();
        this.motherName = minimalDTO.getMotherName();
        this.bloodGroup = minimalDTO.getBloodGroup();
        this.nationalIdNumber = minimalDTO.getNationalIdNumber();
        this.panNumber = minimalDTO.getPanNumber();
        this.localIdNumber = minimalDTO.getLocalIdNumber();
        this.specialist = minimalDTO.getSpecialist();
        this.referenceContact = minimalDTO.getReferenceContact();
        this.qualification = minimalDTO.getQualification();
        this.currentAddress = minimalDTO.getCurrentAddress();
        this.permanentAddress = minimalDTO.getPermanentAddress();
        this.workExperience = minimalDTO.getWorkExperience();
        this.specialization = minimalDTO.getSpecialization();
        this.note = minimalDTO.getNote();

        // Payroll Info
        this.epfNumber = minimalDTO.getEpfNumber();
        this.basicSalary = minimalDTO.getBasicSalary();
        this.contractType = minimalDTO.getContractType();
        this.workShift = minimalDTO.getWorkShift();
        this.workLocation = minimalDTO.getWorkLocation();

        // Leave Info
        this.casualLeave = minimalDTO.getCasualLeave();
        this.privilegeLeave = minimalDTO.getPrivilegeLeave();
        this.sickLeave = minimalDTO.getSickLeave();
        this.maternityLeave = minimalDTO.getMaternityLeave();
        this.paternityLeave = minimalDTO.getPaternityLeave();
        this.feverLeave = minimalDTO.getFeverLeave();
        this.lop = minimalDTO.getLop();

        // Bank Info
        this.accountTitle = minimalDTO.getAccountTitle();
        this.bankAccountNo = minimalDTO.getBankAccountNo();
        this.bankName = minimalDTO.getBankName();
        this.ifscCode = minimalDTO.getIfscCode();
        this.bankBranchName = minimalDTO.getBankBranchName();

        this.roleDetails = roleDetails;
    }

}







