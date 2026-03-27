package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Finding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_FindingRepository extends JpaRepository<HMS_TM_Finding, String> {
    List<HMS_TM_Finding> findAllByIsActiveTrue();

    Optional<HMS_TM_Finding> findByFindingIdAndIsActiveTrue(String findingId);

    Optional<HMS_TM_Finding> findByWtIdAndIsActiveTrue(String id);
}


