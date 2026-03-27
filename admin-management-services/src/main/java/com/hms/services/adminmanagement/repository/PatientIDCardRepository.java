package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_PatientIDCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientIDCardRepository extends JpaRepository<HMS_TM_PatientIDCard, Long> {

    Optional<HMS_TM_PatientIDCard> findByIdAndIsActiveTrue(String id);

    List<HMS_TM_PatientIDCard> findAllByIsActiveTrue();
}



