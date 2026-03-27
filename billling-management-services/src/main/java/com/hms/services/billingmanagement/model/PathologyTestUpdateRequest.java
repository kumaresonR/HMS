package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PathologyTestUpdateRequest {
    private String approvedBy;
    private LocalDate approvedDate;
    private String result;
    private List<PathologyTestParameterDTO> parameters;
}

