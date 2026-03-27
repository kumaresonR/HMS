package com.hms.services.inventorymanagement.repository;

import com.hms.services.inventorymanagement.entity.HMS_TM_AddIssueItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AddIssueItemRepository extends JpaRepository<HMS_TM_AddIssueItem, String> {
    List<HMS_TM_AddIssueItem> findByDeletedFalse();

    Optional<HMS_TM_AddIssueItem> findByIdAndDeletedFalse(String id);

    @Query("SELECT a FROM HMS_TM_AddIssueItem a WHERE a.issueDate BETWEEN :startDateTime AND :endDateTime AND a.deleted = false")
    Page<HMS_TM_AddIssueItem> findByIssueDateBetweenAndDeletedFalse(
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            Pageable pageable
    );

    @Query("SELECT a FROM HMS_TM_AddIssueItem a WHERE a.issueDate BETWEEN :startDate AND :endDate AND a.deleted = false")
    List<HMS_TM_AddIssueItem> findByIssueDateBetweenAndDeletedFalse(LocalDateTime startDate, LocalDateTime endDate);


}

