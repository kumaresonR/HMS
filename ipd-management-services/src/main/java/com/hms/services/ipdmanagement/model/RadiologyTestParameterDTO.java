package com.hms.services.ipdmanagement.model;

import lombok.Data;

@Data
public class RadiologyTestParameterDTO {
    private String parameterId;
    private String radiologyTestId;
    private String parameterName;
    private String normalRange;
    private String reportValue;
    private String unit;
}
