package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TW_ReferralCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_ReferralCategoryRepository extends JpaRepository<HMS_TW_ReferralCategory, String> {
    List<HMS_TW_ReferralCategory> findAllByIsActiveTrue();
    Optional<HMS_TW_ReferralCategory> findByCategoryIdAndIsActiveTrue(String categoryId);
}


