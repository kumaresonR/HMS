package com.hms.services.ambulancemanagement.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name="HMS_TM_AMBULANCECALLTRANSACTION")
public class HMS_TM_AmbulanceCallTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PAYMENT_ID")
    private String paymentId;

    @Column(name = "VEHICLE_CHARGE_ID")
    private String vehicleChargeId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @Column(name = "DATE")
    private Date date;

    @Column(name = "PAYMENT_MODE")
    private String paymentMode;

    @Column(name = "CHECK_NO")
    private String checkNo;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @Column(name = "CHECK_DATE")
    private Date checkDate;

    @Column(name = "ATTACHMENT")
    private String attachment;

    @Column(name = "PAYMENT_AMOUNT")
    private Double paymentAmount;

    @Column(name = "IS_ACTIVE")
    private boolean isActive;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;









}


