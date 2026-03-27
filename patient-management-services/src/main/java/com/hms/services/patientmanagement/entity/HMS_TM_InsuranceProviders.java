package com.hms.services.patientmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;


@Data
@Entity
@Table(name = "HMS_TM_INSURANCE_PROVIDERS")
public class HMS_TM_InsuranceProviders {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "INSURANCE_ID")
    private String insuranceId;

    @Column(name = "PROVIDER_NAME")
    private String providerName;

    @Column(name = "POLICY_NUMBER")
    private String policyNumber;

    @Column(name = "PATIENT_ID")
    private String patientId;

    @Column(name = "COVERAGE_DETAILS")
    private String coverageDetails;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "TIME")
    private LocalTime time;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;

}
