package com.hms.services.adminmanagement.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeRoleDTO {
    private String firstName;
    private String lastName;
    private String staffId;
    private String phone;
    private String roleName;

}



