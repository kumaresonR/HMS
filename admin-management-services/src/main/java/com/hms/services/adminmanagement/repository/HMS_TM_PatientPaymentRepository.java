package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TM_PatientPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_PatientPaymentRepository extends JpaRepository<HMS_TM_PatientPayment, String> {

    List<HMS_TM_PatientPayment> findAllByIsActiveTrue();
    Optional<HMS_TM_PatientPayment> findByBillIdAndIsActiveTrue(String billId);
}



