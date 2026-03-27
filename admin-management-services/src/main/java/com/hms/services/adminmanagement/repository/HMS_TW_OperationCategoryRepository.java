package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_OperationCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_OperationCategoryRepository extends JpaRepository<HMS_TW_OperationCategory, String> {

    List<HMS_TW_OperationCategory> findAllByIsActiveTrue();
    Optional<HMS_TW_OperationCategory> findByCategoryIdAndIsActiveTrue(String id);

    Optional<HMS_TW_OperationCategory> findByCategoryId(String categoryId);
}



