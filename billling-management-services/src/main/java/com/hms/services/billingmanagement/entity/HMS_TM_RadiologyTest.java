package com.hms.services.billingmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_RADIOLOGY_TEST")
public class HMS_TM_RadiologyTest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "TEST_ID")
    private String testId;

    @Column(name = "RADIOLOGY_TEST_ID", length = 100)
    private String radiologyTestId;

    @Column(name = "REPORT_DAYS")
    private Integer reportDays;

    @Column(name = "REPORT_DATE")
    private LocalDateTime reportDate;

    @Column(name = "TAX")
    private Double tax;

    @Column(name = "AMOUNT")
    private Double amount;

    @Column(name = "SAMPLE_COLLECTED", length = 100)
    private String sampleCollected;

    @Column(name = "PRESCRIPTION_NO")
    private String prescriptionNo;

    @Column(name = "APPROVED_BY", length = 100)
    private String approvedBy;

    @Column(name = "COLLECTED_DATE")
    private LocalDate collectedDate;

    @Column(name = "RADIOLOGY_CENTER", length = 255)
    private String radiologyCenter;

    @Column(name = "APPROVED_DATE")
    private LocalDate approvedDate;

    @Lob
    @Column(name = "UPLOAD_REPORT", columnDefinition = "text")
    private String uploadReport;

    @Column(name = "RESULT")
    private String result;

    @Column(name = "BILL_ID")
    private String billId;
}


