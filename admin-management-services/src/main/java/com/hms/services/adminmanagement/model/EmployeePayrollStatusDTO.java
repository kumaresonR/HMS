package com.hms.services.adminmanagement.model;

import lombok.Data;

@Data
public class EmployeePayrollStatusDTO {
    private String employeeId;
    private String staffId;
    private String firstName;
    private String lastName;
    private String status;
    private String action;
    private String payrollId;
    private EmployeeDTO employeeDetails;

    public EmployeePayrollStatusDTO(String employeeId, String staffId, String firstName,
                                    String lastName, String status, String action,
                                    String payrollId, EmployeeDTO employeeDetails) {
        this.employeeId = employeeId;
        this.staffId = staffId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.status = status;
        this.action = action;
        this.payrollId = payrollId;
        this.employeeDetails = employeeDetails;
    }
}



