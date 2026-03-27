package com.hms.services.adminmanagement.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
public class DepartmentHeadDTO {


    private String departmentId;
    private String name;
    private String authStat;
    private String recordStat;
    private String modNo;
    private boolean deleted;
    private String employeeId;
    private String employeeFirstName;
    private String employeeLastName;

}



