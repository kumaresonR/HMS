package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_BedGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_BedGroupRepository extends JpaRepository<HMS_TW_BedGroup, String> {
    Optional<HMS_TW_BedGroup> findByBedGroupIdAndIsActiveTrue(String id);
    Page<HMS_TW_BedGroup> findAllByIsActiveTrue(Pageable pageable);

}



