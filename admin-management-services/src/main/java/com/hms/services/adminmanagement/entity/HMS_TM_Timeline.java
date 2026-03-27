package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "HMS_TM_TIMELINE")
public class HMS_TM_Timeline {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "TIMELINE_ID")
    private String timelineId;

    @Column(name = "EMPLOYEE_ID")
    private String employeeId;

    @Column(name = "TITLE", nullable = false)
    private String title;

    @Column(name = "DATE", nullable = false)
    private LocalDate date;

    @Column(name = "DESCRIPTION", length = 500)
    private String description;

    @Lob
    @Column(name = "DOCUMENT", columnDefinition = "text")
    private String document;

    @Column(name = "DELETED")
    private boolean deleted = false;

}


