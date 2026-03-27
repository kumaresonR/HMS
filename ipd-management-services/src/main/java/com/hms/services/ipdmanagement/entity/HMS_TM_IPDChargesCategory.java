package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name="HMS_TM_IPDCHARGESCATEGORY", schema = "ipd")
public class HMS_TM_IPDChargesCategory {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CHARGE_CATEGORY_ID")
    private String chargeCategoryId;

    @Column(name = "CHARGE_TYPE_ID")
    private String chargeTypeId;

    @Column(name = "DESCRIPTION", nullable = false, length = 200)
    private String chargeCategory;

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

