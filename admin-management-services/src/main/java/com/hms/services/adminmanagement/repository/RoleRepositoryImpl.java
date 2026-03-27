package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Role;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RoleRepositoryImpl implements RoleRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<HMS_TM_Role> findByIdWithTypeFix(String roleId) {
        // Use native query with explicit casting for PostgreSQL
        // Explicitly specify the admin schema as shown in HeidiSQL
        // Quote identifiers to preserve case sensitivity
        String sql = "SELECT \"ROLE_ID\", \"ROLE_NAME\", " +
                     "COALESCE(CAST(\"DESCRIPTION\" AS TEXT), '') as \"DESCRIPTION\", " +
                     "COALESCE(CAST(\"SCOPE_IDS\" AS TEXT), '') as \"SCOPE_IDS\" " +
                     "FROM \"admin\".\"HMS_TM_ROLE\" WHERE \"ROLE_ID\" = :roleId";
        
        try {
            @SuppressWarnings("unchecked")
            List<Object[]> results = entityManager.createNativeQuery(sql)
                    .setParameter("roleId", roleId)
                    .getResultList();
            
            if (results != null && !results.isEmpty()) {
                Object[] result = results.get(0);
                if (result != null && result.length >= 4) {
                    HMS_TM_Role role = new HMS_TM_Role();
                    role.setRoleId(result[0] != null ? result[0].toString() : null);
                    role.setRoleName(result[1] != null ? result[1].toString() : null);
                    role.setDescription(result[2] != null ? result[2].toString() : null);
                    role.setScopeIds(result[3] != null && !result[3].toString().isEmpty() ? result[3].toString() : null);
                    return Optional.of(role);
                }
            }
            return Optional.empty();
        } catch (jakarta.persistence.NoResultException e) {
            return Optional.empty();
        } catch (Exception e) {
            // Log detailed error for debugging
            System.err.println("========== ERROR FINDING ROLE ==========");
            System.err.println("Role ID: " + roleId);
            System.err.println("Error Type: " + e.getClass().getName());
            System.err.println("Error Message: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("Cause: " + e.getCause().getMessage());
            }
            e.printStackTrace();
            System.err.println("=========================================");
            return Optional.empty();
        }
    }

    @Override
    public HMS_TM_Role findByRoleIdWithTypeFix(String roleId) {
        return findByIdWithTypeFix(roleId).orElse(null);
    }
}

