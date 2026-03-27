package com.hms.services.adminmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

@Data
@Entity
@Table(name = "HMS_TM_SCOPE")
public class HMS_TM_Scope {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "SCOPE_ID", updatable = false, nullable = false)
    private String scopeId;

    @Column(name = "SCOPE_NAME", length = 50, nullable = false)
    private String scopeName;

    @Column(name = "DESCRIPTION", length = 255)
    private String description;

//    @ManyToMany(mappedBy = "scopes")
//    private Set<HMS_TM_Role> roles;
}



