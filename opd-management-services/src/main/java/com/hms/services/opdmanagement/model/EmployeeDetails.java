package com.hms.services.opdmanagement.model;


import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeDetails {

    private String employeeId;
    private String staffId;
    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate dateOfBirth;
    private LocalDate dateOfJoining;
    private String email;
    private String phone;
    private String maritalStatus;
    private String designation;
    private String specialist;
}

