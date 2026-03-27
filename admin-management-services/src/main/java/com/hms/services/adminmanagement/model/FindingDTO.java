package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FindingDTO {

    private String findingId;
    private String categoryId;
    private String finding;
    private String description;
    private String wtId;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
    private LocalDateTime lastModifiedAt;
    private String lastModifiedBy;
    private FindingCategoryDTO findingCategory;


}



