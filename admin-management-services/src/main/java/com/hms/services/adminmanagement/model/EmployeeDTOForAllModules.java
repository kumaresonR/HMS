package com.hms.services.adminmanagement.model;


import com.hms.services.adminmanagement.entity.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class EmployeeDTOForAllModules {
    private String employeeId;
    private String staffId;
    private String approverId;
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
    private int lop;

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

    private List<HMS_TM_AttendanceLeave> attendanceLeaves;
    private List<LeaveRequestForEmployeeDTO> leaveRequests;
    private List<HMS_TM_Payroll> payrollDetails;
    private List<HMS_TM_Timeline> tmTimelines;

    private Map<String, Integer> totalLeaves;
    private Map<String, Integer> usedLeaves;
    private Map<String, Integer> availableLeaves;

    public EmployeeDTOForAllModules(HMS_TM_Employee employee, String departmentName, RolesDTO roleDetails,
                                    List<HMS_TM_AttendanceLeave> attendanceLeaves,
                                    List<LeaveRequestForEmployeeDTO> leaveRequests,
                                    List<HMS_TM_Payroll> payrollDetails,
                                    List<HMS_TM_Timeline> tmTimelines) {
        this.employeeId = employee.getEmployeeId();
        this.staffId = employee.getStaffId();
        this.approverId=employee.getReporterId();
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
        this.departmentName = departmentName;
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

        this.attendanceLeaves = attendanceLeaves;
        this.leaveRequests = leaveRequests;
        this.payrollDetails = payrollDetails;
        this.tmTimelines = tmTimelines;
    }
}




