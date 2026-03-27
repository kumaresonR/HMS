package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Purpose;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HMS_TM_PurposeRepository extends JpaRepository<HMS_TM_Purpose, String> {
    List<HMS_TM_Purpose> findAllByIsActiveTrue();
    Optional<HMS_TM_Purpose> findByIdAndIsActiveTrue(String id);

    Optional<HMS_TM_Purpose> findByWtIdAndIsActiveTrue(String id);
}


