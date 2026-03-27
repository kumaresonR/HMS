package com.hms.services.billingmanagement.model;


import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class PrescriptionDTO {


    private String prescriptionId;
    private String patientId;
    private String ipdId;
    private String doctorId;
    private String headerNote;
    private String footerNote;
    private List<String> pathologyId;
    private List<String> radiologyId;
    private String datePrescribed;
    private String findingCategory;
    private String finding;
    private String findingDescription;
    private String reportName;
    private String attachment;
    private String validUntil;
    private String status;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalTime time;
    private Boolean isActive;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
    private EmployeeDetails doctor;
//    private List<PrescriptionDetailsDTO> prescriptionDetails;
//    private List<PathologyTestDetailsDTO> pathologyTestDetails;
//    private List<RadiologyTestDetailsDTO> radiologyTestDetails;
}


