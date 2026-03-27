package com.hms.services.ipdmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Data
@Entity
@Table(name="HMS_TM_IPDOPERATION", schema = "ipd")
public class HMS_TM_IPDOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "OPERATION_ID", updatable = false, nullable = false)
    private String operationId;

    @Column(name = "OT_REFERENCE_NO")
    private String otReferenceNo;

    @Column(name = "PATIENT_ID")
    private String patientId;

    @Column(name = "OPD_ID")
    private String ipdId;

    @Column(name = "DOCTOR_ID")
    private String doctorId;

    @Column(name = "OPERATION_CATEGORY_ID")
    private String operationCategoryId;

    @Lob
    @Column(name = "OPERATION_CATEGORY", columnDefinition = "text")
    private String operationCategory;

    @Lob
    @Column(name = "OPERATION_NAME", columnDefinition = "text")
    private String operationName;

    @Column(name = "OPERATION_NAME_ID")
    private String operationNameId;

    @Column(name = "OPERATION_DATE", columnDefinition = "timestamp")
    private LocalDateTime operationDate;

    @Column(name = "ASSISTANT_CONSULTANT_1")
    private String assistantConsultant1;

    @Column(name = "ASSISTANT_CONSULTANT_2")
    private String assistantConsultant2;

    @Column(name = "ANESTHETIST")
    private String anesthetist;

    @Column(name = "ANESTHESIA_TYPE")
    private String anesthesiaType;

    @Column(name = "OT_TECHNICIAN")
    private String otTechnician;

    @Column(name = "OT_ASSISTANT")
    private String otAssistant;

    @Column(name = "REMARK")
    private String remark;

    @Column(name = "RESULT")
    private String result;

    @Column(name = "STATUS")
    private String status="Pending";

    @Column(name = "CUSTOM_FIELD")
    private String customField;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;
}

