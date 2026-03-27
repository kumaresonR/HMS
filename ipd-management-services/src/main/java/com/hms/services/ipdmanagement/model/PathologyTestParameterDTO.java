package com.hms.services.ipdmanagement.model;

import lombok.Data;

@Data
public class PathologyTestParameterDTO {
    private String parameterId;
    private String pathologyTestId;
    private String parameterName;
    private String normalRange;
    private String reportValue;
    private String unit;
}

