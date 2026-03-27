package com.hms.services.ipdmanagement.repository;

import com.hms.services.ipdmanagement.entity.HMS_TM_BedGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.net.ContentHandler;
import java.util.Optional;


@Repository
public interface BedGroupRepository extends JpaRepository<HMS_TM_BedGroup, String> {


    Optional<HMS_TM_BedGroup> findByBedGroupIdAndIsActiveTrue(String bedGroupId);

    Page<HMS_TM_BedGroup> findAllByIsActiveTrue(Pageable pageable);
}

