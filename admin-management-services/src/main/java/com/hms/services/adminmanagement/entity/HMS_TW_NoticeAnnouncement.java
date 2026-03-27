package com.hms.services.adminmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

import java.time.LocalDate;

public class HMS_TW_NoticeAnnouncement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NOTICE_ID")
    private Long noticeId;

    @Column(name = "TITLE", length = 255, nullable = false)
    private String title;

    @Lob
    @Column(name = "DESCRIPTION", columnDefinition = "text")
    private String description;

    @Column(name = "ISSUED_BY", nullable = false)
    private Long issuedBy; // Foreign Key referencing Admin Users

    @Column(name = "DATE", columnDefinition = "timestamp")
    private LocalDate date;

    @Column(name = "VALID_UNTIL", columnDefinition = "timestamp")
    private LocalDate validUntil;

}


