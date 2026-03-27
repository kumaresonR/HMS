package com.hms.services.ipdmanagement.repository;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDChargesCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPDChargesCategoryRepository extends JpaRepository<HMS_TM_IPDChargesCategory, String> {

    List<HMS_TM_IPDChargesCategory> findByIsActiveTrue();

    List<HMS_TM_IPDChargesCategory> findByChargeTypeIdAndIsActiveTrue(String chargeTypeId);

    Optional<HMS_TM_IPDChargesCategory> findByChargeCategoryIdAndIsActiveTrue(String chargeCategoryId);
}

