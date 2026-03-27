package com.hms.services.patientmanagement.repository;


import com.hms.services.patientmanagement.entity.HMS_TM_EmergencyContacts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyContactRepository extends JpaRepository<HMS_TM_EmergencyContacts, String> {

//    boolean existsByPatientId(String id);
//
//    void deleteByPatientId(String id);
//
//    List<HMS_TM_EmergencyContacts> findAllByPatientIdIn(List<String> patientIds);
//
//    List<HMS_TM_EmergencyContacts> findAllByPatientId(String patientId);
//
//    Optional<HMS_TM_EmergencyContacts> findByPatientId(String patientId);
//
//    Page<HMS_TM_EmergencyContacts> findAllByPatientId(String patientId, Pageable pageable);
//
//    Optional<HMS_TM_EmergencyContacts> findByEmergencyContactId(String emergencyContactId);

    List<HMS_TM_EmergencyContacts> findAllByPatientIdAndIsActiveTrue(String id);

    List<HMS_TM_EmergencyContacts> findAllByPatientIdInAndIsActiveTrue(List<String> patientIds);

    Page<HMS_TM_EmergencyContacts> findAllByPatientIdAndIsActiveTrue(String patientId, Pageable pageable);

    HMS_TM_EmergencyContacts findAllByEmergencyContactIdAndIsActiveTrue(String emergencyContactId);
}

