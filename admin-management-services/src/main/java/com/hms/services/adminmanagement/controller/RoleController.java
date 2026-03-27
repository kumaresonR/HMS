package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Role;
import com.hms.services.adminmanagement.model.RoleWithScopesDTO;
import com.hms.services.adminmanagement.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_Role> createRole(@RequestBody HMS_TM_Role role) {
        HMS_TM_Role createdRole = roleService.createRole(role);
        return ResponseEntity.ok(createdRole);
    }

//    @GetMapping("/all")
//    public RoleDTO getAllRoles() {
//        return roleService.getAllRoles();
//    }

//    @GetMapping("/{roleId}")
//    public ResponseEntity<HMS_TM_Role> getRole(@PathVariable String roleId) {
//        return roleService.getRole(roleId)
//                .map(ResponseEntity::ok)
//                .orElseThrow(null);
//    }

    @GetMapping("/all")
    public ResponseEntity<List<RoleWithScopesDTO>> getAllRoles() {
        List<RoleWithScopesDTO> rolesWithScopes = roleService.getAllRoles();
        return ResponseEntity.ok(rolesWithScopes);
    }


    @GetMapping("/{roleId}")
    public ResponseEntity<RoleWithScopesDTO> getRole(@PathVariable String roleId) {
        RoleWithScopesDTO roleWithScopes = roleService.getRoleWithScope(roleId);
        return ResponseEntity.ok(roleWithScopes);
    }

    @PutMapping("update/{roleId}")
    public ResponseEntity<HMS_TM_Role> updateRole(@PathVariable String roleId, @RequestBody HMS_TM_Role updatedRole) {
        HMS_TM_Role role = roleService.updateRole(roleId, updatedRole);
        return ResponseEntity.ok(role);
    }

    @DeleteMapping("/{roleId}")
    public ResponseEntity<Void> deleteRole(@PathVariable String roleId) {
        roleService.deleteRole(roleId);
        return ResponseEntity.noContent().build();
    }
}


