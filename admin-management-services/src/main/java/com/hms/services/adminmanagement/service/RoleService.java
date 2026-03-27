package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Role;
import com.hms.services.adminmanagement.entity.HMS_TM_Scope;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.RoleWithScopesDTO;
import com.hms.services.adminmanagement.model.ScopeDTO;
import com.hms.services.adminmanagement.repository.RoleRepository;
import com.hms.services.adminmanagement.repository.ScopeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

//@Service
//public class RoleService {
//
//    @Autowired
//    private RoleRepository roleRepository;
//
//    @Autowired
//    private ScopeRepository scopeRepository;
//
//    public HMS_TM_Role createRole(HMS_TM_Role role) {
//        Set<HMS_TM_Scope> scopeEntities = new HashSet<>();
//
//        for (HMS_TM_Scope scope : role.getScopes()) {
//            HMS_TM_Scope scopeEntity = scopeRepository.findById(scope.getScopeId())
//                    .orElseThrow(() -> new CustomException("Scope not found with id " + scope.getScopeId(), HttpStatus.BAD_REQUEST));
//            scopeEntities.add(scopeEntity);
//        }
//
//        role.setScopes(scopeEntities);
//        return roleRepository.save(role);
//    }
//
//    public RoleDTO getAllRoles() {
//        List<HMS_TM_Role> roles = roleRepository.findAll();
//        LocalDate currentDate = LocalDate.now();
//        return new RoleDTO(currentDate, roles);
//    }
//
//    public Optional<HMS_TM_Role> getRole(String roleId) {
//        return roleRepository.findById(roleId);
//    }
//
//    public HMS_TM_Role updateRole(String roleId, HMS_TM_Role updatedRole) {
//        return roleRepository.findById(roleId)
//                .map(role -> {
//                    role.setRoleName(updatedRole.getRoleName());
//                    role.setDescription(updatedRole.getDescription());
//                    role.setScopes(updatedRole.getScopes());
//                    return roleRepository.save(role);
//                })
//                .orElseThrow(() -> new CustomException("Role not found",HttpStatus.NOT_FOUND));
//    }
//
//    public void deleteRole(String roleId) {
//        roleRepository.deleteById(roleId);
//    }
//
//}

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ScopeRepository scopeRepository;

    public HMS_TM_Role createRole(HMS_TM_Role role) {
        Set<String> scopeIdsSet = new HashSet<>();
        if (role.getScopeIds() != null && !role.getScopeIds().trim().isEmpty()) {
            for (String scopeId : role.getScopeIds().split(",")) {
                String trimmedScopeId = scopeId.trim();
                if (!trimmedScopeId.isEmpty()) {
                    scopeRepository.findById(trimmedScopeId)
                            .orElseThrow(() -> new CustomException("Scope not found with id " + trimmedScopeId, HttpStatus.BAD_REQUEST));
                    scopeIdsSet.add(trimmedScopeId);
                }
            }
        }
        role.setScopeIds(scopeIdsSet.isEmpty() ? null : String.join(",", scopeIdsSet));
        return roleRepository.save(role);
    }

    public List<RoleWithScopesDTO> getAllRoles() {
        List<HMS_TM_Role> roles = roleRepository.findAll();
        return roles.stream().map(role -> {
            List<ScopeDTO> scopeDTOs = new ArrayList<>();
            if (role.getScopeIds() != null && !role.getScopeIds().trim().isEmpty()) {
                scopeDTOs = Arrays.stream(role.getScopeIds().split(","))
                        .map(String::trim)
                        .filter(scopeId -> !scopeId.isEmpty())
                        .map(scopeId -> scopeRepository.findById(scopeId)
                                .map(scope -> new ScopeDTO(scope.getScopeId(), scope.getScopeName(), scope.getDescription()))
                                .orElseThrow(() -> new CustomException("Scope not found with id " + scopeId, HttpStatus.BAD_REQUEST)))
                        .collect(Collectors.toList());
            }

            return new RoleWithScopesDTO(
                    role.getRoleId(),
                    role.getRoleName(),
                    role.getDescription(),
                    scopeDTOs
            );
        }).collect(Collectors.toList());
    }

    public RoleWithScopesDTO getRoleWithScope(String roleId) {
        HMS_TM_Role role = roleRepository.findByIdWithTypeFix(roleId)
                .orElseThrow(() -> new CustomException("Role not found with ID " + roleId, HttpStatus.NOT_FOUND));

        List<ScopeDTO> scopeDTOs = new ArrayList<>();
        if (role.getScopeIds() != null && !role.getScopeIds().trim().isEmpty()) {
            String[] scopeIdsArray = role.getScopeIds().split(",");
            for (String scopeId : scopeIdsArray) {
                String trimmedScopeId = scopeId.trim();
                if (!trimmedScopeId.isEmpty()) {
                    HMS_TM_Scope scope = scopeRepository.findById(trimmedScopeId)
                            .orElseThrow(() -> new CustomException("Scope not found with ID " + trimmedScopeId, HttpStatus.BAD_REQUEST));
                    scopeDTOs.add(new ScopeDTO(scope.getScopeId(), scope.getScopeName(), scope.getDescription()));
                }
            }
        }

        return new RoleWithScopesDTO(role.getRoleId(), role.getRoleName(), role.getDescription(), scopeDTOs);
    }

    public HMS_TM_Role updateRole(String roleId, HMS_TM_Role updatedRole) {
        return roleRepository.findById(roleId)
                .map(existingRole -> {
                    existingRole.setRoleName(updatedRole.getRoleName());
                    existingRole.setDescription(updatedRole.getDescription());

                    Set<String> scopeIdsSet = new HashSet<>();
                    if (updatedRole.getScopeIds() != null && !updatedRole.getScopeIds().trim().isEmpty()) {
                        for (String scopeId : updatedRole.getScopeIds().split(",")) {
                            String trimmedScopeId = scopeId.trim();
                            if (!trimmedScopeId.isEmpty()) {
                                scopeRepository.findById(trimmedScopeId)
                                        .orElseThrow(() -> new CustomException("Scope not found with id " + trimmedScopeId, HttpStatus.BAD_REQUEST));
                                scopeIdsSet.add(trimmedScopeId);
                            }
                        }
                    }
                    existingRole.setScopeIds(scopeIdsSet.isEmpty() ? null : String.join(",", scopeIdsSet));
                    return roleRepository.save(existingRole);
                })
                .orElseThrow(() -> new CustomException("Role not found with ID " + roleId, HttpStatus.NOT_FOUND));
    }

    public void deleteRole(String roleId) {
        if (!roleRepository.existsById(roleId)) {
            throw new CustomException("Role not found with ID " + roleId, HttpStatus.NOT_FOUND);
        }
        roleRepository.deleteById(roleId);
    }
}



