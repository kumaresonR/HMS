package com.hms.services.adminmanagement.model;

import com.hms.services.adminmanagement.entity.HMS_TM_LeaveRequest;
import lombok.Data;


@Data
public class LeaveRequestDTO {

    private String leaveRequestId;
    private String employeeId;
    private String approverId;
    private String employeeName;
    private String leaveType;
    private String reason;
    private String leaveFromDate;
    private String leaveToDate;
    private long duration;
    private String applyDate;
    private String status;

    public LeaveRequestDTO(HMS_TM_LeaveRequest leaveRequest) {
        this.leaveRequestId = leaveRequest.getLeaveRequestId();
        this.employeeId = leaveRequest.getEmployeeId();
        this.leaveType = leaveRequest.getLeaveType();
        this.reason = leaveRequest.getReason();
        this.approverId = leaveRequest.getApproverId();
        this.leaveFromDate = leaveRequest.getLeaveFromDate().toString();
        this.leaveToDate = leaveRequest.getLeaveToDate().toString();
        this.applyDate = leaveRequest.getApplyDate().toString();
        this.status = leaveRequest.getStatus();
    }
}


