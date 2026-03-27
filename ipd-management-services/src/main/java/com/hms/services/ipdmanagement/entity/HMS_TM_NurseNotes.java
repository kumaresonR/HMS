package com.hms.services.ipdmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "HMS_TM_NURSE_NOTES", schema = "ipd")
public class HMS_TM_NurseNotes {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "NOTES_ID")
    private String notesId;

    @Column(name = "IPD_ID", nullable = false)
    private String ipdId;

    @Column(name = "NURSE_ID", nullable = false)
    private String nurseId;

    @Column(name = "DATE",columnDefinition = "timestamp")
//    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime date;

    @Column(name = "NOTE", length = 1000)
    private String note;

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

