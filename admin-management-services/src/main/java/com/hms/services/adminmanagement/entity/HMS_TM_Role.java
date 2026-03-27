package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HMS_TM_ROLE")
public class HMS_TM_Role {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ROLE_ID", updatable = false, nullable = false)
    private String roleId;

    @Column(name = "ROLE_NAME", length = 50, nullable = false, unique = true)
    private String roleName;

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Column(name = "SCOPE_IDS", length = 4000)
    private String scopeIds;
}



