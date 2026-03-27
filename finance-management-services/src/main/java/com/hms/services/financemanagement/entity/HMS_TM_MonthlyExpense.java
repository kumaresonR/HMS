package com.hms.services.financemanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_MONTHLY_EXPENSE")
public class HMS_TM_MonthlyExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MONTHLY_EXPENSE_ID")
    private String expenseId;

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


