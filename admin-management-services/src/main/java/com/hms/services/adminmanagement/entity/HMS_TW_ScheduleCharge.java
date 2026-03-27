package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TW_SCHEDULE_CHARGE")
public class HMS_TW_ScheduleCharge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "SCHEDULE_CHARGE_ID")
    private String scheduleChargeId;

    @Column(name = "CHARGE_ID")
    private String chargeId;

    @Column(name = "ID")
    private String id;//TPAId

    @Column(name = "CHARGE", nullable = false)
    private Double charge;

    @Column(name = "IS_ACTIVE", nullable = false)
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



