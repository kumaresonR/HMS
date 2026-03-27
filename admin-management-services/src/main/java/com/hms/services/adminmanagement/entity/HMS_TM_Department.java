package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_DEPARTMENT")
public class HMS_TM_Department {

    @Id
    @Column(name = "DEPARTMENT_ID")
    private String departmentId;

    @Column(name = "NAME")
    private String name;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;

    @Column(name = "EMPLOYEE_ID")
    private String employeeId;

}



