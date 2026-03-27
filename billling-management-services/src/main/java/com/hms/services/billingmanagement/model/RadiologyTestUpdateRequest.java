package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class RadiologyTestUpdateRequest {
    private String approvedBy;
    private LocalDate approvedDate;
    private String result;
    private List<RadiologyTestParameterDTO> parameters;
}

