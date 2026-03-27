package com.hms.services.ipdmanagement.model;


import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentsDTO {

//    private String commentId;
    private String comment;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;

}

