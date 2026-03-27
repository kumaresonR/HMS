package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "ANNUAL_CALENDAR_EVENTS")
@Data
public class HMS_TM_AnnualCalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "FROM_DATE")
    private LocalDate fromDate;

    @Column(name = "TO_DATE")
    private LocalDate toDate;

    @Column(name = "DATE")
    private LocalDate date;

    @Column(name = "DESCRIPTION" , length = 1000)
    private String description;

    @Column(name = "DELETED")
    private Boolean deleted = false;
}





