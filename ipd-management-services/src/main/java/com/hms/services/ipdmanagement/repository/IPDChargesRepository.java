package com.hms.services.ipdmanagement.repository;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDCharges;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IPDChargesRepository extends JpaRepository<HMS_TM_IPDCharges, String> {

    Optional<HMS_TM_IPDCharges> findByIpdChargeIdAndIsActiveTrue(String ipdChargeId);
    List<HMS_TM_IPDCharges> findAllByIsActiveTrue();
    List<HMS_TM_IPDCharges> findByIpdIdAndIsActiveTrue(String ipdId);

}

