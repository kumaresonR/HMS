package com.hms.services.ipdmanagement.repository;

import com.hms.services.ipdmanagement.entity.HMS_TM_IPDChargesName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPDChargesNameRepository extends JpaRepository<HMS_TM_IPDChargesName, String> {

    List<HMS_TM_IPDChargesName> findByChargeCategoryIdAndIsActiveTrue(String chargeCategoryId);
    List<HMS_TM_IPDChargesName> findByIsActiveTrue();

    Optional<HMS_TM_IPDChargesName> findByChargeNameIdAndIsActiveTrue(String chargeNameId);
}

