package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_Specialist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_SpecialistRepository extends JpaRepository<HMS_TW_Specialist, String> {
    Optional<HMS_TW_Specialist> findBySpecialistIdAndDeletedFalse(String specialistId);
    List<HMS_TW_Specialist> findByDeletedFalse();

}




