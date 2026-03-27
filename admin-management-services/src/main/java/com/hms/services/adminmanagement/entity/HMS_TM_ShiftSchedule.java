package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "HMS_TM_SHIFT_SCHEDULE")
public class HMS_TM_ShiftSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "SCHEDULE_ID")
    private String scheduleId;

    @Column(name = "EMPLOYEE_ID", nullable = false)
    private String employeeId;

    @Column(name = "REPEAT_DAYS")
    private String repeatDays;

    @Column(name = "SHIFT_TYPE", length = 20)
    private String shiftType;

    @Column(name = "START_TIME")
    private LocalTime startTime;

    @Column(name = "END_TIME")
    private LocalTime endTime;

    @Column(name = "SHIFT_DATE")
    private LocalDate shiftDate;

    @Column(name = "DOCTOR_NAME")
    private String doctorName;

    @Column(name = "DURATION_MINUTES")
    private String durationMinutes;

    @Column(name = "DELETED")
    private Boolean deleted = false;
}



