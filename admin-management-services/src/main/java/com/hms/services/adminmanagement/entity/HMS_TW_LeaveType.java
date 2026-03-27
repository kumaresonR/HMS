package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TW_LEAVE_TYPE")
public class HMS_TW_LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "LEAVE_TYPE_ID")
    private String leaveTypeId;

    @Column(name = "NAME")
    private String name;

    @Column(name = "AUTH_STAT")
    private String authStat = "UNAUTHORIZED";

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo= "V1";

    @Column(name = "DELETED")
    private boolean deleted = false;
}




