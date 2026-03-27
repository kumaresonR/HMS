package com.hms.services.billingmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_RADIOLOGY_PARAMETERS")
public class HMS_TM_Radiology_Parameters {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PARAMETER_ID")
    private String parameterId;

    @Column(name = "TEST_ID")
    private String testId;

    @Column(name = "PARAMETER_NAME")
    private String parameterName;

    @Column(name = "NORMAL_RANGE")
    private String normalRange;

    @Column(name = "REPORT_VALUE")
    private String reportValue;

    @Column(name = "UNIT")
    private String unit;
}


