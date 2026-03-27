package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_ADD_ITEM_CATEGORY")
public class HMS_TM_Add_Item_Category {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "ITEM_CATEGORY")
    private String itemCategory;

    @Column(name = "DESCRIPTION" , length = 1000)
    private String description;

    @Column(name = "AUTH_STAT")
    private String authStat;

    @Column(name = "RECORD_STAT")
    private String recordStat = "OPENED";

    @Column(name = "MOD_NO")
    private String modNo;
}



