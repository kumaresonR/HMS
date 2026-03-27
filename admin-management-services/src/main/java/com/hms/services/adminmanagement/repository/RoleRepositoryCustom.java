package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Role;
import java.util.Optional;

public interface RoleRepositoryCustom {
    Optional<HMS_TM_Role> findByIdWithTypeFix(String roleId);
    HMS_TM_Role findByRoleIdWithTypeFix(String roleId);
}

