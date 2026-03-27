package com.hms.services.laboratorymanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_RADIOLOGY_TEST_PARAMETERS")
public class HMS_TM_RadiologyTestParameters {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PARAMETER_ID")
    private String parameterId;

    @Column(name = "RADIOLOGY_TEST_ID", nullable = false)
    private String radiologyTestId;

    @Column(name = "PARAMETER_NAME", length = 100, nullable = false)
    private String parameterName;

    @Column(name = "NORMAL_RANGE", length = 100, nullable = false)
    private String normalRange;

    @Column(name = "UNIT", length = 50, nullable = false)
    private String unit;
}

