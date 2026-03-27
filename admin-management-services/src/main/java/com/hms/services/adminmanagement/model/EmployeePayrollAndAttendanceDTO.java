package com.hms.services.adminmanagement.model;

import com.hms.services.adminmanagement.entity.HMS_TM_AttendanceLeave;
import lombok.Data;

import java.util.List;


@Data
public class EmployeePayrollAndAttendanceDTO {
    private String employeeId;
    private String fullName;
    private String roleId;
    private String roleName;
    private String departmentId;
    private String departmentName;
    private String designation;
    private String phoneNumber;
    private String photo;
    private String epfNumber;
    private String email;

    private PayrollFields payrollFields;
    private List<HMS_TM_AttendanceLeave> hmsTmAttendanceLeave;

    public EmployeePayrollAndAttendanceDTO(String employeeId, String fullName, String roleId, String roleName,
                                           String phoneNumber, String photo, String departmentId, String departmentName,
                                           String designation, String epfNumber, String email,
                                           PayrollFields payrollFields,
                                           List<HMS_TM_AttendanceLeave> hmsTmAttendanceLeave) {
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.roleId = roleId;
        this.roleName = roleName;
        this.phoneNumber = phoneNumber;
        this.photo = photo;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.designation = designation;
        this.epfNumber = epfNumber;
        this.email = email;
        this.payrollFields = payrollFields;
        this.hmsTmAttendanceLeave = hmsTmAttendanceLeave;
    }
}




