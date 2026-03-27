package com.hms.services.adminmanagement.model;

import lombok.Data;

@Data
public class DepartmentDTO {
    private String departmentId;
    private String departmentName;

    public DepartmentDTO(String departmentId, String departmentName) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
    }
}


