package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_AddPathology;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_AddPathologyRepository extends JpaRepository<HMS_TW_AddPathology, String> {

    List<HMS_TW_AddPathology> findByDeletedFalse();

    Optional<HMS_TW_AddPathology> findByIdAndDeletedFalse(String id);
}



