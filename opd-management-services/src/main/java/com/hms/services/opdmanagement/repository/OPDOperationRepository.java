package com.hms.services.opdmanagement.repository;


import com.hms.services.opdmanagement.entity.HMS_TM_OPDOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface  OPDOperationRepository extends JpaRepository<HMS_TM_OPDOperation, String> {

    List<HMS_TM_OPDOperation> findByOpdIdAndIsActiveTrue(String opdId);

    Optional<HMS_TM_OPDOperation> findByOperationIdAndIsActiveTrue(String operationId);

    List<HMS_TM_OPDOperation> findAllByIsActiveTrue();

    List<HMS_TM_OPDOperation> findByOtReferenceNoAndIsActiveTrue(String refNo);

    @Query("SELECT o FROM HMS_TM_OPDOperation o WHERE DATE(o.operationDate) = :operationDate AND o.status = :status AND o.isActive = true")
    List<HMS_TM_OPDOperation> findByOperationDateAndStatus(LocalDate operationDate, String status);
}

