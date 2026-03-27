package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_SymptomsHead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_SymptomsHeadRepository extends JpaRepository<HMS_TM_SymptomsHead, String> {
    List<HMS_TM_SymptomsHead> findAllByIsActiveTrue();

    Optional<HMS_TM_SymptomsHead> findByWtIdAndIsActiveTrue(String id);
}


