package com.hms.services.laboratorymanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_RADIOLOGY_TESTS")
public class HMS_TM_RadiologyTests {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "RADIOLOGY_TEST_ID")
    private String radiologyTestId;

    @Column(name = "TEST_NAME", length = 100, nullable = false)
    private String testName;

    @Column(name = "SHORT_NAME", length = 50, nullable = false)
    private String shortName;

    @Column(name = "TEST_TYPE", length = 50)
    private String testType;

    @Column(name = "CATEGORY_NAME", length = 50, nullable = false)
    private String categoryName;

    @Column(name = "SUB_CATEGORY", length = 50)
    private String subCategory;

    @Column(name = "REPORT_DAYS", nullable = false)
    private int reportDays;

    @Column(name = "CHARGE_CATEGORY", length = 50, nullable = false)
    private String chargeCategory;

    @Column(name = "CHARGE_NAME", length = 50, nullable = false)
    private String chargeName;

    @Column(name = "TAX_PERCENTAGE")
    private double taxPercentage;

    @Column(name = "STANDARD_CHARGE")
    private double standardCharge;

    @Column(name = "AMOUNT")
    private double amount;

    @Column(name = "DELETED")
    private Boolean deleted = false;
}

