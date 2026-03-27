package com.hms.services.laboratorymanagement.entity;



import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_LABREPORTS")
public class HMS_TM_LabReports {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "REPORT_ID")
    private String reportId;

    @Column(name = "PATIENT_ID", nullable = false)
    private String patientId;

    @Column(name = "REPORT_DATE", columnDefinition = "timestamp", nullable = false)
    private LocalDateTime reportDate;

    @Column(name = "TEST_RESULT_ID", nullable = false)
    private String testResultId;

    @Column(name = "REPORT_FILE", nullable = false)
    private byte[] reportFile;

}


