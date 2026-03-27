package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_BedDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.net.ContentHandler;
import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_BedDetailsRepository extends JpaRepository<HMS_TM_BedDetails, String> {
    Page<HMS_TM_BedDetails> findAllByIsActiveTrue(Pageable pageable);

    Optional<HMS_TM_BedDetails> findByBedDetailsIdAndIsActiveTrue(String id);

    Optional<HMS_TM_BedDetails> findByWtIdAndIsActiveTrue(String id);

    List<HMS_TM_BedDetails> findAllByBedGroupIdAndIsActiveTrue(String id);

    Page<HMS_TM_BedDetails> findAllByIsActiveTrueAndNotAvailableFalse(Pageable pageable);

    List<HMS_TM_BedDetails> findAllByBedGroupIdAndIsActiveTrueAndNotAvailableFalse(String id);

    @Query("SELECT COUNT(b) FROM HMS_TW_BedDetails b WHERE b.bedGroupId = :bedGroupId")
    int countByBedGroupId(String bedGroupId);
}


