package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_PERSON")
public class HMS_TM_AddReferralPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PERSON_ID")
    private String personId;

    @Column(name = "REFERRER_NAME", nullable = false, length = 100)
//    @NotBlank(message = "Referrer Name is required")
    private String referrerName;

    @Column(name = "REFERRER_CONTACT", length = 15)
    private String referrerContact;

    @Column(name = "CONTACT_PERSON_NAME", length = 100)
    private String contactPersonName;

    @Column(name = "CONTACT_PERSON_PHONE", length = 15)
    private String contactPersonPhone;

    @Column(name = "CATEGORY", nullable = false, length = 50)
//    @NotBlank(message = "Category is required")
    private String category;

    @Column(name = "STANDARD_COMMISSION")
    private Double standardCommission;

    @Column(name = "ADDRESS", length = 1000)
    private String address;

    @Column(name = "OPD_COMMISSION", nullable = false)
    //@NotNull(message = "OPD Commission is required")
    private Double opdCommission;

    @Column(name = "IPD_COMMISSION", nullable = false)
   // @NotNull(message = "IPD Commission is required")
    private Double ipdCommission;

    @Column(name = "PHARMACY_COMMISSION", nullable = false)
    //@NotNull(message = "Pharmacy Commission is required")
    private Double pharmacyCommission;

    @Column(name = "PATHOLOGY_COMMISSION", nullable = false)
    //@NotNull(message = "Pathology Commission is required")
    private Double pathologyCommission;

    @Column(name = "RADIOLOGY_COMMISSION", nullable = false)
    //@NotNull(message = "Radiology Commission is required")
    private Double radiologyCommission;

    @Column(name = "BLOOD_BANK_COMMISSION", nullable = false)
    //@NotNull(message = "Blood Bank Commission is required")
    private Double bloodBankCommission;

    @Column(name = "AMBULANCE_COMMISSION", nullable = false)
    //@NotNull(message = "Ambulance Commission is required")
    private Double ambulanceCommission;

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



