package com.hms.services.laboratorymanagement.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@Table(name = "HMS_TM_PATHOLOGY_TEST_PARAMETERS")
public class HMS_TM_PathologyTestParameters {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PARAMETER_ID")
    private String parameterId;

    @Column(name = "PATHOLOGY_TEST_ID", nullable = false)
    private String pathologyTestId;

    @Column(name = "PARAMETER_NAME", length = 100)
    private String parameterName;

    @Column(name = "NORMAL_RANGE", length = 100)
    private String normalRange;

    @Column(name = "UNIT", length = 50)
    private String unit;
}



