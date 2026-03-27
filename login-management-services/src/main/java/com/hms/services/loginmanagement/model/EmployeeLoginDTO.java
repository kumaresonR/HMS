package com.hms.services.loginmanagement.model;

import lombok.Data;
import lombok.ToString;

@Data
public class EmployeeLoginDTO {
    private String employeeId;
    private String staffId;
    private String departmentId;
    private String reporterId;
    private String firstName;
    private String lastName;
    private String password;
    private String gender;
    private String email;
    private String phone;
    private String userName;
    private String roleId;
    private boolean isActive;
}

