//package com.hms.services.ipdmanagement.entity;
//
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//
//@Data
//@Entity
//@Table
//public class HMS_TM_IPDTreatments {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(name = "TREATMENT_ID")
//    private String treatmentId;
//
//    @Column(name = "ADMISSION_ID", nullable = false)
//    private String admissionId;
//
//    @Column(name = "DOCTOR_ID", nullable = false)
//    private String doctorId;
//
//    @Column(name = "TREATMENT_DATE", columnDefinition = "TIMESTAMP")
//    private LocalDate treatmentDate;
//
//    @Column(name = "TREATMENT_TYPE")
//    private String treatmentType;
//
//    @Lob    @Column(name = "DESCRIPTION")
//    private String description;
//
//    @Lob    @Column(name = "NOTES")
//    private String notes;
//
//    @Column(name = "IS_ACTIVE")
//    private boolean isActive;
//
//    @Column(name = "STATUS", nullable = false, length = 20)
//    private String status;
//
//    @Column(name = "CREATED_AT", updatable = false)
//    private LocalDateTime createdAt;
//
//    @Column(name = "CREATED_BY")
//    private String createdBy;
//
//    @Column(name = "LAST_MODIFIED_BY")
//    private String lastModifiedBy;
//
//    @Column(name = "LAST_MODIFIED_AT")
//    private LocalDateTime lastModifiedAt;
//}

