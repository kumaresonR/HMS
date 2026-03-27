package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaxCategoryDTO {

    private String id;
    private String name;
    private double percentage;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}



