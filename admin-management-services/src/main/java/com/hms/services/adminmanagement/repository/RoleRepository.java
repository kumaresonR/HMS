package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<HMS_TM_Role, String>, RoleRepositoryCustom {
    @Query("SELECT r.roleName FROM HMS_TM_Role r WHERE r.roleId = :roleId")
    Optional<String> findRoleNameById(@Param("roleId") String roleId);

    Optional<HMS_TM_Role> findByRoleName(String roleName);

    // Default implementation delegates to custom method to handle type mismatch
    default HMS_TM_Role findByRoleId(String roleId) {
        return findByRoleIdWithTypeFix(roleId);
    }

}



