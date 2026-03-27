package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OPDTimeLineDTO {

    private String timeLineId;
    private String opdId;
    private LocalDateTime date;
    private String description;
    private String title;
    private boolean isActive;
    private String attachment;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}

