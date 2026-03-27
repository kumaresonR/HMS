package com.hms.services.adminmanagement.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "HMS_TM_PAYROLL")
public class HMS_TM_Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PAYROLL_ID", updatable = false, nullable = false)
    private String payrollId;

    @Column(name = "EMPLOYEE_ID")
    private String employeeId;

    @Column(name = "BASIC_SALARY")
    private double basicSalary;

    @Column(name = "TOTAL_EARNINGS")
    private double totalEarnings;

    @Column(name = "TOTAL_DEDUCTIONS")
    private double totalDeductions;

    @OneToMany(mappedBy = "payroll", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<HMS_TM_Earning> earnings;

    @OneToMany(mappedBy = "payroll", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<HMS_TM_Deduction> deductions;

    @Column(name = "GROSS_SALARY")
    private double grossSalary;

    @Column(name = "TAX")
    private double tax;

    @Column(name = "TAX_PERCENTAGE")
    private double taxPercentage;

    @Column(name = "NET_SALARY")
    private double netSalary;

    @Column(name = "PAYROLL_DATE")
    private String payrollDate;

    @Column(name = "MONTH")
    private String month;

    @Column(name = "YEAR")
    private int year;

    @Column(name = "PAYMENT_MODE")
    private String paymentMode;

    @Column(name = "CHEQUE_NO", length = 50)
    private String chequeNo;

    @Column(name = "CHEQUE_DATE")
    private LocalDate chequeDate;

    @Lob
    @Column(name = "ATTACH_DOCUMENT", columnDefinition = "text")
    private String attachDocument;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "STATUS")
    private String status = "Not Generated";

    @Column(name = "ACTION")
    private String action = "GENERATE PAYROLL";
}


