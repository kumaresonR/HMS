package com.hms.services.opdmanagement.repository;



import com.hms.services.opdmanagement.entity.HMS_TM_OPDCharges;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OPDChargesRepository extends JpaRepository<HMS_TM_OPDCharges, String> {

    Optional<HMS_TM_OPDCharges> findByOpdChargeIdAndIsActiveTrue(String ipdChargeId);
    List<HMS_TM_OPDCharges> findAllByIsActiveTrue();
    List<HMS_TM_OPDCharges> findByOpdIdAndIsActiveTrue(String ipdId);

}

