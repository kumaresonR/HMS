package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TM_FindingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_FindingCategoryRepository extends JpaRepository<HMS_TM_FindingCategory, String> {
    List<HMS_TM_FindingCategory> findAllByIsActiveTrue();

    Optional<HMS_TM_FindingCategory> findByFindingCategoryIdAndIsActiveTrue(String findingCategoryId);

    Optional<HMS_TM_FindingCategory> findByWtIdAndIsActiveTrue(String id);
}


