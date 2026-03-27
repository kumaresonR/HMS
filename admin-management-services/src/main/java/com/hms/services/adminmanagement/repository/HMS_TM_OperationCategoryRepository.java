package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_OperationCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_OperationCategoryRepository extends JpaRepository<HMS_TM_OperationCategory, String> {

    List<HMS_TM_OperationCategory> findAllByIsActiveTrue();


    Optional<HMS_TM_OperationCategory> findByCategoryIdAndIsActiveTrue(String categoryId);

    Optional<HMS_TM_OperationCategory> findByWtIdAndIsActiveTrue(String id);

    Optional<HMS_TM_OperationCategory> findByCategoryId(String categoryId);
}



