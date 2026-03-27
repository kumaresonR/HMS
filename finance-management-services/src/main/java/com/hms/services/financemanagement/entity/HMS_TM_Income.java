package com.hms.services.financemanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_INCOME_RECORD")
public class HMS_TM_Income {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "INCOME_ID")
    private String incomeId;

    @Column(name = "INCOME_HEAD")
    private String incomeHead;

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



