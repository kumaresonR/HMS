package com.hms.services.otmanagement.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
public class IPDOperationDTO {

    private String operationId;
    private String patientId;
    private String otReferenceNo;
    private String opdId;
    private String doctorId;
    private String operationCategory;
    private String operationName;
    private String operationCategoryId;
    private String operationNameId;
    private LocalDateTime operationDate;
    private String assistantConsultant1;
    private String assistantConsultant2;
    private String anesthetist;
    private String anesthesiaType;
    private String OTTechnician;
    private String OTAssistant;
    private String remark;
    private String result;
    private String status;
    private String customField;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
    private EmployeeDetails doctor;
    private String firstName;
    private String lastName;
    private String dateOfBirth;
    private String gender;
    private String age;

}

