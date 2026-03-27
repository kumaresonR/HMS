package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.util.List;

@Data
public class RoleDto {

    private String roleId;
    private String roleName;
    private String description;
    private List<ScopeDTO> scopes;
}


