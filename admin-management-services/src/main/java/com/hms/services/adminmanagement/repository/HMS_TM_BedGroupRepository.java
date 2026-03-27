package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TM_BedGroup;
import com.hms.services.adminmanagement.entity.HMS_TW_BedGroup;
import com.hms.services.adminmanagement.model.BedGroupDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_BedGroupRepository extends JpaRepository<HMS_TM_BedGroup, String> {

    Page<HMS_TM_BedGroup> findAllByIsActiveTrue(Pageable pageable);

    Optional<HMS_TM_BedGroup> findByBedGroupIdAndIsActiveTrue(String id);

    Optional<HMS_TM_BedGroup> findByWtIdAndIsActiveTrue(String id);

    @Query("SELECT new com.hms.services.adminmanagement.model.BedGroupResponse(bg.bedGroupId, bg.name) " +
            "FROM HMS_TM_BedGroup bg WHERE bg.isActive = true")
    List<BedGroupDTO> findAllByIsActiveBedGroups();
}



