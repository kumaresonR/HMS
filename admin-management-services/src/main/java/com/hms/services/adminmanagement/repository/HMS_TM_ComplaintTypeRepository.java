package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_ComplaintType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_ComplaintTypeRepository extends JpaRepository<HMS_TM_ComplaintType, String> {

    List<HMS_TM_ComplaintType> findAllByIsActiveTrue();
    Optional<HMS_TM_ComplaintType> findByIdAndIsActiveTrue(String id);

    Optional<HMS_TM_ComplaintType> findByWtIdAndIsActiveTrue(String id);
}



