package com.hms.services.adminmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TW_DEPARTMENT")
public class HMS_TW_Department {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "DEPARTMENT_ID")
    private String departmentId;

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

    @Column(name = "EMPLOYEE_ID")
    private String employeeId;

}




