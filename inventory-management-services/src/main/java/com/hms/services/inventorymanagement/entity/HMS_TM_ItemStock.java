package com.hms.services.inventorymanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_ITEM_STOCK")
public class HMS_TM_ItemStock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ITEM_STOCK_ID")
    private String itemStockId;

    @Column(name = "ITEM_CATEGORY")
    private String itemCategory;

    @Column(name = "ITEM")
    private String item;

    @Column(name = "SUPPLIER")
    private String supplier;

    @Column(name = "STORE")
    private String store;

    @Column(name = "QUANTITY")
    private Integer quantity;

    @Column(name = "PURCHASE_PRICE")
    private Double purchasePrice;

    @Column(name = "DATE")
    private Date date;

    @Column(name = "DESCRIPTION", length = 1000)
    private String description;

    @Lob
    @Column(name = "ATTACH_DOCUMENT", columnDefinition = "text")
    private String attachDocument;

    @Column(name = "DELETED")
    private Boolean deleted = false;
}

