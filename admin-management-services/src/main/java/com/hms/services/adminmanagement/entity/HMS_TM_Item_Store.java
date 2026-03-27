package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_ITEM_STORE")
public class HMS_TM_Item_Store {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "ITEM_STORE_NAME")
    private String itemStoreName;

    @Column(name = "ITEM_STOCK_CODE")
    private String itemStockCode;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;
}



