package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_Operation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_OperationRepository extends JpaRepository<HMS_TW_Operation, String> {

    List<HMS_TW_Operation> findAllByIsActiveTrue();
    Optional<HMS_TW_Operation> findByOperationIdAndIsActiveTrue(String id);

    Optional<HMS_TW_Operation> findByCategoryIdAndIsActiveTrue(String categoryId);
}



