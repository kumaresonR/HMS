package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_LEAVE_TYPE")
public class HMS_TM_LeaveType {

    @Id
    @Column(name = "LEAVE_TYPE_ID")
    private String leaveTypeId;

    @Column(name = "NAME")
    private String name;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;

}



