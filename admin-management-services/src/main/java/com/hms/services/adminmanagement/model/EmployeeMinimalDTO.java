package com.hms.services.adminmanagement.model;


import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeMinimalDTO {
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
//
public EmployeeMinimalDTO(String employeeId, String staffId, String firstName, String lastName, String reporterId,
                          String password, String gender, LocalDate dateOfBirth, LocalDate dateOfJoining,
                          String email, String phone, String maritalStatus, String designation, String roleId,
                          String doctorFee, String departmentId, String fatherName, String motherName,
                          String bloodGroup, String nationalIdNumber, String panNumber, String localIdNumber,
                          String specialist, String referenceContact, String qualification, String currentAddress,
                          String permanentAddress, String workExperience, String specialization, String note,
                          String epfNumber, double basicSalary, String contractType, String workShift,
                          String workLocation, int casualLeave, int privilegeLeave, int sickLeave,
                          int maternityLeave, int paternityLeave, int feverLeave, int lop,
                          String accountTitle, String bankAccountNo, String bankName, String ifscCode,
                          String bankBranchName) {
    this.employeeId = employeeId;
    this.staffId = staffId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.reporterId = reporterId;
    this.password = password;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.dateOfJoining = dateOfJoining;
    this.email = email;
    this.phone = phone;
    this.maritalStatus = maritalStatus;
    this.designation = designation;
    this.roleId = roleId;
    this.doctorFee = doctorFee;
    this.departmentId = departmentId;
    this.fatherName = fatherName;
    this.motherName = motherName;
    this.bloodGroup = bloodGroup;
    this.nationalIdNumber = nationalIdNumber;
    this.panNumber = panNumber;
    this.localIdNumber = localIdNumber;
    this.specialist = specialist;
    this.referenceContact = referenceContact;
    this.qualification = qualification;
    this.currentAddress = currentAddress;
    this.permanentAddress = permanentAddress;
    this.workExperience = workExperience;
    this.specialization = specialization;
    this.note = note;
    this.epfNumber = epfNumber;
    this.basicSalary = basicSalary;
    this.contractType = contractType;
    this.workShift = workShift;
    this.workLocation = workLocation;
    this.casualLeave = casualLeave;
    this.privilegeLeave = privilegeLeave;
    this.sickLeave = sickLeave;
    this.maternityLeave = maternityLeave;
    this.paternityLeave = paternityLeave;
    this.feverLeave = feverLeave;
    this.lop = lop;
    this.accountTitle = accountTitle;
    this.bankAccountNo = bankAccountNo;
    this.bankName = bankName;
    this.ifscCode = ifscCode;
    this.bankBranchName = bankBranchName;
}


}



