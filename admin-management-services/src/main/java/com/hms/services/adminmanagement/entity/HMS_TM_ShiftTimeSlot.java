package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_SHIFT_TIME_SLOT")
public class HMS_TM_ShiftTimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "TIME_SLOT_ID")
    private String timeSlotId;

    @Column(name = "SCHEDULE_ID", nullable = false)
    private String scheduleId;

    @Column(name = "TIME_SLOT", nullable = false)
    private String timeSlot;

    @Column(name = "STATUS", nullable = false)
    private String status;

    @Column(name = "DELETED")
    private Boolean deleted = false;
}



