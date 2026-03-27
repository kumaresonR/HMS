package com.hms.services.adminmanagement.model;

import com.hms.services.adminmanagement.entity.HMS_TM_Role;
import com.hms.services.adminmanagement.entity.HMS_TM_Scope;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class RoleWithScopesDTO {
    private String roleId;
    private String roleName;
    private String description;
    private List<ScopeDTO> scopes; // Includes full scope details
}



