package com.hms.services.laboratorymanagement.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "HMS_TM_LAB_INVESTIGATION")
public class HMS_TM_LabInvestigation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "LAB_INVESTIGATION_ID", length = 36, nullable = false, updatable = false)
    private String id;

    @Column(name = "TEST_NAME", length = 100, nullable = false)
    private String testName;

    @Column(name = "LAB", length = 100)
    private String lab;

    @Column(name = "SAMPLE_COLLECTED_BY", length = 100)
    private String sampleCollectedBy;

    @Column(name = "LAB_CENTER", length = 100)
    private String labCenter;

    @Column(name = "SAMPLE_COLLECTION_DATE")
    private LocalDate sampleCollectionDate;

    @Column(name = "EXPECTED_DATE")
    private LocalDate expectedDate;

    @Column(name = "APPROVED_BY", length = 100)
    private String approvedBy;

    @Column(name = "APPROVAL_DATE")
    private LocalDate approvalDate;

    @Column(name = "DELETED")
    private Boolean deleted = false;
}

