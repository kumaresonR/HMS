package com.hms.services.laboratorymanagement.model;

import lombok.Data;

@Data
public class PathologyTestParameterDTO {
    private String parameterId;
    private String pathologyTestId;
    private String parameterName;
    private String normalRange;
    private String unit;
}

