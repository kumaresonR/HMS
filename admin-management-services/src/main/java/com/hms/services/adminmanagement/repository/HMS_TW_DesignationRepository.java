package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_DesignationRepository extends JpaRepository<HMS_TW_Designation, String> {

    Optional<HMS_TW_Designation> findByDesignationIdAndDeletedFalse(String designationId);

    List<HMS_TW_Designation> findByDeletedFalse();
}



