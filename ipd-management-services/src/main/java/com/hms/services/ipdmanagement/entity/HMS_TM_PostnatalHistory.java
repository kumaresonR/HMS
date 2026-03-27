package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_POSTNATAL_HISTORY", schema = "ipd")
public class HMS_TM_PostnatalHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "POSTNATAL_ID")
    private String postnatalId;

    @Column(name = "IPD_ID")
    private String ipdId;

    @Column(name = "LABOR_TIME",columnDefinition = "timestamp")
    private LocalDateTime laborTime;

    @Column(name = "DELIVERY_TIME",columnDefinition = "timestamp")
    private LocalDateTime deliveryTime;

    @Lob
    @Column(name = "ROUTINE_QUESTION", columnDefinition = "text")
    private String routineQuestion;

    @Lob
    @Column(name = "GENERAL_REMARK", columnDefinition = "text")
    private String generalRemark;

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

