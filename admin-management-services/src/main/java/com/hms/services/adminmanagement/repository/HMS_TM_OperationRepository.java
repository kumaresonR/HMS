package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TM_Operation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_OperationRepository extends JpaRepository<HMS_TM_Operation, String> {
    List<HMS_TM_Operation> findAllByIsActiveTrue();

    Optional<HMS_TM_Operation> findByOperationIdAndIsActiveTrue(String operationId);

    Optional<HMS_TM_Operation> findByWtIdAndIsActiveTrue(String id);
}



