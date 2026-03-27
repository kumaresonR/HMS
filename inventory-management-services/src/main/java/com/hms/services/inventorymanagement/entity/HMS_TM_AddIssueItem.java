package com.hms.services.inventorymanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_ADD_ISSUE_ITEM")
public class HMS_TM_AddIssueItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "USER_TYPE")
    private String userType;

    @Column(name = "ISSUE_TO")
    private String issueTo;

    @Column(name = "ISSUED_BY")
    private String issuedBy;

    @Column(name = "ISSUE_DATE")
    private Date issueDate;

    @Column(name = "RETURN_DATE")
    private Date returnDate;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "ITEM_CATEGORY")
    private String itemCategory;

    @Column(name = "ITEM")
    private String item;

    @Column(name = "QUANTITY")
    private Integer quantity;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "DELETED")
    private Boolean deleted = false;
}


