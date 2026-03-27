package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TM_ChargeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_ChargeCategoryRepository extends JpaRepository<HMS_TM_ChargeCategory, String> {


    List<HMS_TM_ChargeCategory> findAllByIsActiveTrue();

    Optional<HMS_TM_ChargeCategory> findByCategoryIdAndIsActiveTrue(String id);

    Optional<HMS_TM_ChargeCategory> findByWtIdAndIsActiveTrue(String id);

    List<HMS_TM_ChargeCategory> findAllByChargeTypeIdAndIsActiveTrue(String typeId);
}



