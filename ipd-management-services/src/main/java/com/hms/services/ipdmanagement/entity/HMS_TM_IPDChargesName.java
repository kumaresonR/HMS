package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name="HMS_TM_IPDCHARGESNAME", schema = "ipd")
public class HMS_TM_IPDChargesName {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CHARGE_NAME_ID")
    private String chargeNameId;

    @Column(name = "CHARGE_CATEGORY_ID")
    private String chargeCategoryId;

    @Column(name = "DESCRIPTION", nullable = false, length = 200)
    private String chargeName;

    @Column(name = "STANDARD_CHARGE", nullable = false)
    private Double standardCharge;

    @Column(name = "TPA_CHARGE")
    private Double tpaCharge;

    @Column(name = "TAX_PERCENTAGE", nullable = false)
    private Double taxPercentage;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;





}

