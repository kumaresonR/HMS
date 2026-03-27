package com.hms.services.financemanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_DAILY_PROFIT_LOSS")
public class HMS_TM_DailyProfitAndLoss {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String Id;

    @Column(name = "MODULE_NAME")
    private String moduleName;

    @Column(name = "PROFIT_OR_LOSS")
    private BigDecimal profitOrLoss;

    @Column(name = "TOTAL_INCOME")
    private BigDecimal totalIncome;

    @Column(name = "TOTAL_EXPENSE")
    private BigDecimal totalExpense;

    @Column(name = "MONTH")
    private int month;

    @Column(name = "YEAR")
    private int year;

    @Column(name = "DATE")
    private LocalDateTime date;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;


}


