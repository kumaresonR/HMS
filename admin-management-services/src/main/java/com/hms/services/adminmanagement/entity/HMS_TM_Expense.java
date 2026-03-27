package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_EXPENSE")
public class HMS_TM_Expense {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "EXPENSE_HEAD")
    private String expenseHead;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;
}



