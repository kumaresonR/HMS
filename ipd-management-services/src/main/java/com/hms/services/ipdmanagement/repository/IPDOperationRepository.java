package com.hms.services.ipdmanagement.repository;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IPDOperationRepository extends JpaRepository<HMS_TM_IPDOperation, String> {

    List<HMS_TM_IPDOperation> findByIpdIdAndIsActiveTrue(String ipdId);

    Optional<HMS_TM_IPDOperation> findByOperationIdAndIsActiveTrue(String operationId);

    List<HMS_TM_IPDOperation> findAllByIsActiveTrue();

    List<HMS_TM_IPDOperation> findByOtReferenceNoAndIsActiveTrue(String refNo);

    @Query("SELECT o FROM HMS_TM_IPDOperation o WHERE DATE(o.operationDate) = :operationDate AND o.status = :status AND o.isActive = true")
    List<HMS_TM_IPDOperation> findByOperationDateAndStatus(LocalDate operationDate,String status);

}

