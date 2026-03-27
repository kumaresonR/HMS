package com.hms.services.patientmanagement.repository;


import com.hms.services.patientmanagement.entity.HMS_TM_Appointments;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<HMS_TM_Appointments, String> {

    Optional<HMS_TM_Appointments> findByAppointmentIdAndIsActiveTrue(String appointmentId);

    Page<HMS_TM_Appointments> findAllByIsActiveTrue(Pageable pageable);

  //  Optional<List<HMS_TM_Appointments>> findAllByPatientIdAndIsActiveTrue(String patientId);
}

