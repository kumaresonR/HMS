package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_TaxCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_TaxCategoryRepository extends JpaRepository<HMS_TM_TaxCategory, String> {
    List<HMS_TM_TaxCategory> findAllByIsActiveTrue();

    Optional<HMS_TM_TaxCategory> findByWtIdAndIsActiveTrue(String id);

    Optional<HMS_TM_TaxCategory> findByIdAndIsActiveTrue(String taxCategoryId);
}



