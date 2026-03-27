package com.hms.services.inventorymanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_ADD_ITEM")
public class HMS_TM_AddItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "ITEM")
    private String item;

    @Column(name = "ITEM_CATEGORY")
    private String itemCategory;

    @Column(name = "UNIT")
    private String unit;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "DELETED")
    private Boolean deleted = false;
}
