package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_COMMENTS", schema = "ipd")
public class HMS_TM_Comments {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "COMMENT_ID")
    private String commentId;

    @Column(name = "NOTES_ID")
    private String notesId;

    @Column(name = "COMMENT",length = 500)
    private String comment;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;


}

