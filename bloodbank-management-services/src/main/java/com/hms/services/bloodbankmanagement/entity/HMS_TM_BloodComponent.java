package com.hms.services.bloodbankmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_BLOOD_COMPONENT")
public class HMS_TM_BloodComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "COMPONENT_ID")
    private String componentId;

    @Column(name = "BLOOD_GROUP", length = 10)
    private String bloodGroup;

    @Column(name = "BAG_STOCK_ID", length = 36)
    private String bagStockId;

    @Column(name = "COMPONENT_NAME", length = 50)
    private String componentName;

    @Column(name = "COMPONENT_BAG", length = 50)
    private String componentBag;

    @Column(name = "VOLUME")
    private Double volume;

    @Column(name = "UNIT", length = 10)
    private String unit;

    @Column(name = "LOT", length = 50)
    private String lot;

    @Column(name = "INSTITUTION", length = 100)
    private String institution;

    @Column(name = "DELETED")
    private Boolean deleted = false;

}


