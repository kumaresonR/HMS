package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.util.List;

@Data
public class RoleDto {

    private String roleId;
    private String roleName;
    private String description;
    private List<ScopeDto> scopes;
}
