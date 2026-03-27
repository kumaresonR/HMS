package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_AddReferralPerson;
import com.hms.services.adminmanagement.entity.HMS_TM_Source;
import com.hms.services.adminmanagement.entity.HMS_TW_Source;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_SourceRepository extends JpaRepository<HMS_TM_Source, String> {

    List<HMS_TM_Source> findAllByIsActiveTrue();
    Optional<HMS_TM_Source> findByIdAndIsActiveTrue(String id);


    Optional<HMS_TM_Source> findByWtIdAndIsActiveTrue(String id);
}



