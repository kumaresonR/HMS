package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_SymptomsHead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_SymptomsHeadRepository extends JpaRepository<HMS_TW_SymptomsHead, String> {
    List<HMS_TW_SymptomsHead> findAllByIsActiveTrue();
    Optional<HMS_TW_SymptomsHead> findBySymptomsHeadIdAndIsActiveTrue(String id);

}


