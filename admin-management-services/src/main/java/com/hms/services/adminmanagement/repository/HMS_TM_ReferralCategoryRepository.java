package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_ReferralCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_ReferralCategoryRepository extends JpaRepository<HMS_TM_ReferralCategory, String> {
    List<HMS_TM_ReferralCategory> findAllByIsActiveTrue();

    Optional<HMS_TM_ReferralCategory> findByCategoryIdAndIsActiveTrue(String categoryId);

    Optional<HMS_TM_ReferralCategory> findByWtIdAndIsActiveTrue(String id);
}


