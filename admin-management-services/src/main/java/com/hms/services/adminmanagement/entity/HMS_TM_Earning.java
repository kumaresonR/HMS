package com.hms.services.adminmanagement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_EARNING")
public class HMS_TM_Earning {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "EARNING_ID", updatable = false, nullable = false)
    private String earningId;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "AMOUNT")
    private double amount;

    @ManyToOne
    @JoinColumn(name = "PAYROLL_ID")
    @JsonBackReference
    private HMS_TM_Payroll payroll;
}



