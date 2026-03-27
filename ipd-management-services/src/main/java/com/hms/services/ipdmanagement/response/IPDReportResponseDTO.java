package com.hms.services.ipdmanagement.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IPDReportResponseDTO {
    private LocalDateTime date;
    private String ipdNo;
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

