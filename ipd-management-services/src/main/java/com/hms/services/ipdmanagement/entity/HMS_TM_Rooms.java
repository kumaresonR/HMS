package com.hms.services.ipdmanagement.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="HMS_TM_ROOMS", schema = "ipd")
public class HMS_TM_Rooms {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ROOM_ID")
    private String roomId;

    @Column(name = "ROOM_NUMBER", nullable = false, length = 20)
    private String roomNumber;

    @Column(name = "ROOM_TYPE", nullable = false, length = 50)
    private String roomType;

    @Column(name = "STATUS", nullable = false, length = 20)
    private String status;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "RATE_PER_DAY")
    private Double ratePerDay;

    @Column(name = "BED_GROUP_Id", nullable = false, length = 50)
    private String bedGroupId;

}

