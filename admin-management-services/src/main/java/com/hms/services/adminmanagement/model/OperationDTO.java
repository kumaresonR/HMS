package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OperationDTO {

    private String operationId;
    private String name;
    private String categoryId;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
    List<OperationCategoryDTO> operationCategory;


}



