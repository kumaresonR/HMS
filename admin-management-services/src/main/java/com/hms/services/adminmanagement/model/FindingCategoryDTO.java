package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FindingCategoryDTO {
    private String findingCategoryId;
    private String findingCategory;
    private String wtId;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
    private LocalDateTime lastModifiedAt;
    private String lastModifiedBy;
}



