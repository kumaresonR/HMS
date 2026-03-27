package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Scope;
import com.hms.services.adminmanagement.model.ScopeDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScopeRepository extends JpaRepository<HMS_TM_Scope, String> {
    // Fetch all HMS_TM_Scope entities by a list of scope IDs
    List<HMS_TM_Scope> findAllById(Iterable<String> ids); // Accepts an Iterable of IDs
}



