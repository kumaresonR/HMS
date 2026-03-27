package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_PATHOLOGY_PARAMETER")
public class HMS_TM_PathologyParameter {

    @Id
    @Column(name = "PARAMETER_ID")
    private String parameterId;

    @Column(name = "PARAMETER_NAME")
    private String parameterName;

    @Column(name = "REFERENCE_RANGE_FROM")
    private String referenceRangeFrom;

    @Column(name = "REFERENCE_RANGE_TO")
    private String referenceRangeTo;

    @Column(name = "UNIT")
    private String unit;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;
}


