package com.hms.services.financemanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@Entity
@Table(name = "HMS_TM_EMPLOYEE_SALARY_EXPENSE")
public class HMS_TM_EmployeeSalaryExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "EXPENSE_ID")
    private String expenseId;

    @Column(name = "MODULE_NAME")
    private String moduleName;

    @Column(name = "TOTAL_AMOUNT")
    private BigDecimal totalAmount;

    @Column(name = "DATE")
    private LocalDateTime date;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;
}


