package com.hms.services.laboratorymanagement.model;

import lombok.Data;

@Data
public class LabReportRequest {
    private String patientId;
    private String reportDate;
    private String testResultId;
}
