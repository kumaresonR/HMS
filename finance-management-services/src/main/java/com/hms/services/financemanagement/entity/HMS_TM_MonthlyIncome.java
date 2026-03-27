package com.hms.services.financemanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_MONTHLY_INCOME")
public class HMS_TM_MonthlyIncome {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MONTHLY_INCOME_ID")
    private String incomeId;

    @Column(name = "MODULE_NAME")
    private String moduleName;

    @Column(name = "TOTAL_AMOUNT")
    private BigDecimal totalAmount;

    @Column(name = "MONTH")
    private int month;

    @Column(name = "YEAR")
    private int year;

    @Column(name = "DATE")
    private LocalDateTime date;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;
}


