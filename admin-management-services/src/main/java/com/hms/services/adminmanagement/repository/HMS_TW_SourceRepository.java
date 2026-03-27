package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_ReferralCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_Source;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface HMS_TW_SourceRepository extends JpaRepository<HMS_TW_Source, String> {

    List<HMS_TW_Source> findAllByIsActiveTrue();
    Optional<HMS_TW_Source> findByIdAndIsActiveTrue(String id);
}



