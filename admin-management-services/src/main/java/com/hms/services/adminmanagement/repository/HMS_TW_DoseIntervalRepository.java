package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_DoseInterval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_DoseIntervalRepository extends JpaRepository<HMS_TW_DoseInterval, String> {

    Optional<HMS_TW_DoseInterval> findByIdAndDeletedFalse(String id);

    List<HMS_TW_DoseInterval> findByDeletedFalse();
}



