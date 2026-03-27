package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "HMS_TM_LEAVE_REQUEST")
public class HMS_TM_LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "LEAVE_REQUEST_ID")
    private String leaveRequestId;

    @Column(name = "EMPLOYEE_ID")
    private String employeeId;

    @Column(name = "LEAVE_TYPE")
    private String leaveType;

    @Column(name = "APPROVER_ID")
    private String approverId;

    @Column(name = "LEAVE_FROM_DATE")
    private LocalDate leaveFromDate;

    @Column(name = "LEAVE_TO_DATE")
    private LocalDate leaveToDate;

    @Column(name = "REASON")
    private String reason;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "APPLY_DATE")
    private LocalDate applyDate;

    @Column(name = "DELETED")
    private Boolean deleted = false;

}




