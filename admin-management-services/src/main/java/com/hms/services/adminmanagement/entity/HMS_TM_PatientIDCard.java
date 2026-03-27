package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_PATIENT_ID_CARD")
public class HMS_TM_PatientIDCard {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "HOSPITAL_NAME", nullable = false, length = 255)
    private String hospitalName;

    @Column(name = "ADDRESS", nullable = false, length = 500)
    private String address;

    @Column(name = "PATIENT_ID_CARD_TITLE", nullable = false, length = 255)
    private String patientIDCardTitle;

    @Column(name = "HEADER_COLOR", length = 20)
    private String headerColor;

    @Column(name = "PATIENT_NAME", nullable = false, length = 255)
    private String patientName;

    @Column(name = "PATIENT_ID", nullable = false, length = 50)
    private String patientId;

    @Column(name = "GUARDIAN_NAME", length = 255)
    private String guardianName;

    @Column(name = "PATIENT_ADDRESS", length = 500)
    private String patientAddress;

    @Column(name = "PHONE_NUMBER", length = 20)
    private String phoneNumber;

    @Column(name = "DATE_OF_BIRTH")
    private LocalDate dateOfBirth;

    @Column(name = "BLOOD_GROUP", length = 10)
    private String bloodGroup;

    @Lob
    @Column(name = "BARCODE_OR_QR_CODE", columnDefinition = "text")
    private String barcodeOrQRCode;

    @Lob
    @Column(name = "BACKGROUND_IMAGE", columnDefinition = "text")
    private String backgroundImage;

    @Lob
    @Column(name = "LOGO_IMAGE", columnDefinition = "text")
    private String logoImage;

    @Lob
    @Column(name = "SIGNATURE_IMAGE", columnDefinition = "text")
    private String signatureImage;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY", length = 50)
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY", length = 50)
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;


}


