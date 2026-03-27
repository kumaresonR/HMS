package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReferralCategoryDTO {

    private String categoryId;
    private String name;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}



