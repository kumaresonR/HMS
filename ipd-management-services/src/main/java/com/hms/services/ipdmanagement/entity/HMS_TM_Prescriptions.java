package com.hms.services.ipdmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Entity
@Table(name="HMS_TM_PRESCRIPTIONS", schema = "ipd")
public class HMS_TM_Prescriptions {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PRESCRIPTION_ID", updatable = false, nullable = false)
    private String prescriptionId;

    @Column(name = "PRESCRIPTION_NO")
    private String prescriptionNo;

    @Column(name = "PATIENT_ID")
    private String patientId;

    @Column(name = "IPD_ID")
    private String ipdId;

    @Column(name = "DOCTOR_ID")
    private String doctorId;

    @ElementCollection
    @CollectionTable(name = "ANTENATAL_PATHOLOGY_IDS", joinColumns = @JoinColumn(name = "ANTENATAL_ID"))
    @Column(name = "PATHOLOGY_ID")
    private List<String> pathologyId;

    @ElementCollection
    @CollectionTable(name = "ANTENATAL_RADIOLOGY_IDS", joinColumns = @JoinColumn(name = "ANTENATAL_ID"))
    @Column(name = "RADIOLOGY_ID")
    private List<String> radiologyId;

    @Column(name = "DATE_PRESCRIBED")
    private String datePrescribed;

    @Column(name = "FINDING_CATEGORY",length = 2000)
    private String findingCategory;

    @Column(name = "FINDING",length = 2000)
    private String finding;

    @Lob
    @Column(name = "FINDING_DESCRIPTION", columnDefinition = "text")
    private String findingDescription;

    @Lob
    @Column(name = "HEADER_NOTE", columnDefinition = "text")
    private String headerNote;

    @Lob
    @Column(name = "FOOTER_NOTE", columnDefinition = "text")
    private String footerNote;

    @Lob
    @Column(name = "REPORT_NAME", columnDefinition = "text")
    private String reportName;

    @Lob
    @Column(name = "ATTACHMENT", columnDefinition = "text")
    private String attachment;

    @Column(name = "VALID_UNTIL")
    private String validUntil;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "PATHOLOGY_PAID")
    private Boolean pathologyPaid=false;

    @Column(name = "RADIOLOGY_PAID")
    private Boolean radiologyPaid=false;

    @Column(name = "PHARMACY_PAID")
    private Boolean pharmacyPaid=false;

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

