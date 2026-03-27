package com.hms.services.financemanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_EXPENSE")
public class HMS_TM_Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "EXPENSE_ID")
    private String expenseId;

    @Column(name = "EXPENSE_HEAD")
    private String expenseHead;

    @Column(name = "NAME")
    private String name;

    @Column(name = "INVOICE_NUMBER")
    private String invoiceNumber;

    @Column(name = "DATE")
    private Date date;

    @Column(name = "AMOUNT")
    private Double amount;

    @Lob
    @Column(name = "ATTACHMENT", columnDefinition = "text")
    private String attachment;

    @Column(name = "DESCRIPTION" , length = 1000)
    private String description;

    @Column(name = "IS_DELETED")
    private boolean isDeleted=false;

}



