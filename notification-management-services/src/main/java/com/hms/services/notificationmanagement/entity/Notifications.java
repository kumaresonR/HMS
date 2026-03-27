package com.hms.services.notificationmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "NOTIFICATIONS")
public class Notifications {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "EMPLOYEE_ID")
    private String employeeId;

    @Column(name = "IPD_OR_OPD_ID")
    private String ipdOrOpdId;

    @Column(name = "PRESCRIPTION_NO")
    private String prescriptionNo;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "REASON_FOR_VISIT")
    private String reasonForVisit;

    @Column(name = "MESSAGE")
    private String message;

    @Column(name = "REPORT_URL")
    private String reportUrl;

    @Column(name = "IS_READ")
    private boolean isRead;

    public Notifications() {}


}

