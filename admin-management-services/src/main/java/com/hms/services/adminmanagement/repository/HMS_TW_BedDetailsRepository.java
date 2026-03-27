package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_BedDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_BedDetailsRepository extends JpaRepository<HMS_TW_BedDetails, String> {
    Optional<HMS_TW_BedDetails> findByBedDetailsIdAndIsActiveTrue(String id);
    Page<HMS_TW_BedDetails> findAllByIsActiveTrue(Pageable pageable);
    @Query("SELECT COUNT(b) FROM HMS_TW_BedDetails b WHERE b.bedGroupId = :bedGroupId")
    int countByBedGroupId(String bedGroupId);
}


