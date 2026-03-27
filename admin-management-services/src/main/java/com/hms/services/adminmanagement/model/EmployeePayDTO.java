package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDate;



@Data
public class EmployeePayDTO {

    private String employeeId;
    private String staffId;
    private String firstName;
    private String lastName;
    private String reporterId;
    private String password;
    private String gender;
    private LocalDate dateOfBirth;
    private LocalDate dateOfJoining;
    private String email;
    private String phone;
    private String maritalStatus;
    private String designation;
    private String roleId;
    private String doctorFee;
    private String departmentId;
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

    // Extra
    private String departmentName;
    private RolesDTO roleDetails;

    public EmployeePayDTO(EmployeeMinimalDTO employee, RolesDTO rolesDTO) {
        this.employeeId = employee.getEmployeeId();
        this.staffId = employee.getStaffId();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.reporterId = employee.getReporterId();
        this.password = employee.getPassword();
        this.gender = employee.getGender();
        this.dateOfBirth = employee.getDateOfBirth();
        this.dateOfJoining = employee.getDateOfJoining();
        this.email = employee.getEmail();
        this.phone = employee.getPhone();
        this.maritalStatus = employee.getMaritalStatus();
        this.designation = employee.getDesignation();
        this.roleId = employee.getRoleId();
        this.doctorFee = employee.getDoctorFee();
        this.departmentId = employee.getDepartmentId();
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
        this.lop = employee.getLop();
        this.accountTitle = employee.getAccountTitle();
        this.bankAccountNo = employee.getBankAccountNo();
        this.bankName = employee.getBankName();
        this.ifscCode = employee.getIfscCode();
        this.bankBranchName = employee.getBankBranchName();

        // extra
        this.roleDetails = rolesDTO;
    }
}




