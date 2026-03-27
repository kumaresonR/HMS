package com.hms.services.opdmanagement.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OPDReportResponseDTO {
    private LocalDateTime date;
    private String opdNo;
    private String patientName;
    private Integer age;
    private String gender;
    private String mobileNumber;
    private String guardianName;
    private String doctorName;
    private String symptoms;
    private Boolean antenatal;
    private String previousMedicalIssue;
}
