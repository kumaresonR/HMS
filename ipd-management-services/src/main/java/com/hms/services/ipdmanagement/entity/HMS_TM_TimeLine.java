package com.hms.services.ipdmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;



@Data
@Entity
@Table(name="HMS_TM_TIMELINE", schema = "ipd")
public class HMS_TM_TimeLine {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "TIME_LINE_ID")
    private String timeLineId;

    @Column(name = "IPD_ID", nullable = false)
    private String ipdId;

    @Column(name = "DATE", nullable = false)
//    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime date;

    @Lob
    @Column(name = "DESCRIPTION", columnDefinition = "text")
    private String description;

    @Column(name = "TITLE", nullable = false, length = 200)
    private String title;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Lob
    @Column(name = "ATTACHMENT", columnDefinition = "text")
    private String attachment;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;


}

