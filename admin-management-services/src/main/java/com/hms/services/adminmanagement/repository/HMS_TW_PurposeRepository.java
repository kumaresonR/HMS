package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TW_Purpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_PurposeRepository extends JpaRepository<HMS_TW_Purpose, String> {
    List<HMS_TW_Purpose> findAllByIsActiveTrue();
    Optional<HMS_TW_Purpose> findByIdAndIsActiveTrue(String id);

}



