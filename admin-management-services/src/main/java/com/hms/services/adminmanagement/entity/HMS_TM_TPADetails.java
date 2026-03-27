package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "HMS_TM_TPA_DETAILS")
public class HMS_TM_TPADetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "TPA_NAME", nullable = false, length = 100)
    private String tpaName;

    @Column(name = "CODE", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "CONTACT_NO", nullable = false, length = 15)
    private String contactNo;

    @Column(name = "ADDRESS", length =500)
    private String address;

    @Column(name = "CONTACT_PERSON_NAME", length = 100)
    private String contactPersonName;

    @Column(name = "CONTACT_PERSON_PHONE", length = 15)
    private String contactPersonPhone;

    @Column(name = "STATUS", length = 50)
    private String status;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean isActive;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "LAST_MODIFIED_BY")
    private String lastModifiedBy;

    @Column(name = "LAST_MODIFIED_AT")
    private LocalDateTime lastModifiedAt;
}



