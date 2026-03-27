package com.hms.services.laboratorymanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_LAB_PATHOLOGY_TESTS")
public class HMS_TM_LabPathologyTests {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PATHOLOGY_TEST_ID")
    private String pathologyTestId;

    @Column(name = "TEST_NAME", length = 100)
    private String testName;

    @Column(name = "SHORT_NAME", length = 50)
    private String shortName;

    @Column(name = "TEST_TYPE", length = 50)
    private String testType;

    @Column(name = "CATEGORY_NAME", length = 50)
    private String categoryName;

    @Column(name = "SUB_CATEGORY", length = 50)
    private String subCategory;

    @Column(name = "METHOD", length = 100)
    private String method;

    @Column(name = "REPORT_DAYS")
    private int reportDays;

    @Column(name = "CHARGE_CATEGORY", length = 50)
    private String chargeCategory;

    @Column(name = "CHARGE_NAME", length = 50)
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


