package com.hms.services.adminmanagement.model;

import com.hms.services.adminmanagement.entity.HMS_TM_Employee;
import com.hms.services.adminmanagement.entity.HMS_TW_Employee;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TWEmployeeDTOForAllModules {
    private String employeeId;
    private String staffId;
    private String reporterId;
    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate dateOfBirth;
    private LocalDate dateOfJoining;
    private String email;
    private String phone;
    private String maritalStatus;
    private String designation;
    private String roleId;
    private String roleName;
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

    private String epfNumber;
    private double basicSalary;
    private String contractType;
    private String workShift;
    private String workLocation;

    private int casualLeave;
    private int privilegeLeave;
    private int sickLeave;
    private int maternityLeave;
    private int paternityLeave;
    private int feverLeave;

    private String accountTitle;
    private String bankAccountNo;
    private String bankName;
    private String ifscCode;
    private String bankBranchName;

    private String facebookUrl;
    private String twitterUrl;
    private String linkedinUrl;
    private String instagramUrl;

    private String resume;
    private String joiningLetter;
    private String resignationLetter;
    private String otherDocuments;

    private Boolean exited;
    private String authStat;
    private String recordStat;
    private String modNo;

    private RolesDTO roleDetails;

    public TWEmployeeDTOForAllModules(HMS_TW_Employee employee, String departmentName, RolesDTO roleDetails) {
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
        this.roleName = roleDetails != null ? roleDetails.getRoleName() : null;
        this.doctorFee = employee.getDoctorFee();
        this.photo = employee.getPhoto();
        this.departmentId = employee.getDepartmentId();
        this.departmentName = departmentName;
        this.fatherName = employee.getFatherName();
        this.motherName = employee.getMotherName();
        this.bloodGroup = employee.getBloodGroup();
        this.nationalIdNumber = employee.getNationalIdNumber();
        this.panNumber = employee.getPanNumber();
        this.localIdNumber = employee.getLocalIdNumber();
        this.specialist = employee.getSpecialist();
        this.referenceContact = employee.getReferenceContact();
        this.qualification = employee.getQualification();
        this.currentAddress = employee.getCurrentAddress();
        this.permanentAddress = employee.getPermanentAddress();
        this.workExperience = employee.getWorkExperience();
        this.specialization = employee.getSpecialization();
        this.note = employee.getNote();

        this.epfNumber = employee.getEpfNumber();
        this.basicSalary = employee.getBasicSalary();
        this.contractType = employee.getContractType();
        this.workShift = employee.getWorkShift();
        this.workLocation = employee.getWorkLocation();

        this.casualLeave = employee.getCasualLeave();
        this.privilegeLeave = employee.getPrivilegeLeave();
        this.sickLeave = employee.getSickLeave();
        this.maternityLeave = employee.getMaternityLeave();
        this.paternityLeave = employee.getPaternityLeave();
        this.feverLeave = employee.getFeverLeave();

        this.accountTitle = employee.getAccountTitle();
        this.bankAccountNo = employee.getBankAccountNo();
        this.bankName = employee.getBankName();
        this.ifscCode = employee.getIfscCode();
        this.bankBranchName = employee.getBankBranchName();

        this.facebookUrl = employee.getFacebookUrl();
        this.twitterUrl = employee.getTwitterUrl();
        this.linkedinUrl = employee.getLinkedinUrl();
        this.instagramUrl = employee.getInstagramUrl();

        this.resume = employee.getResume();
        this.joiningLetter = employee.getJoiningLetter();
        this.resignationLetter = employee.getResignationLetter();
        this.otherDocuments = employee.getOtherDocuments();

        this.authStat = employee.getAuthStat();
        this.recordStat = employee.getRecordStat();
        this.modNo = employee.getModNo();

        this.roleDetails = roleDetails;
    }
}


