package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_FindingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_FindingCategoryRepository extends JpaRepository<HMS_TW_FindingCategory, String> {
    Optional<HMS_TW_FindingCategory> findByFindingCategoryIdAndIsActiveTrue(String findingCategoryId);
    List<HMS_TW_FindingCategory> findAllByIsActiveTrue();
}


