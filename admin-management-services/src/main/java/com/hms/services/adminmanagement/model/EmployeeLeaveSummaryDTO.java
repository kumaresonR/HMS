package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.util.List;

@Data
public class EmployeeLeaveSummaryDTO {

    private EmployeeDTO employeeDetails;
    private List<LeaveSummaryDTO> leaveSummary;
}



