package com.hms.services.adminmanagement.model;

import lombok.Data;

@Data
public class SearchEmployeeDTO {

    private String fullName;
    private String staffId;
    private String employeeId;

    public SearchEmployeeDTO(String employeeId, String staffId, String fullName) {
        this.employeeId = employeeId;
        this.staffId = staffId;
        this.fullName = fullName + " (" + staffId + ")";
    }
}



