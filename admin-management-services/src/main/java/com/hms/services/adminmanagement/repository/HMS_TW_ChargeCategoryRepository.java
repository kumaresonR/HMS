package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TW_ChargeCategory;
import com.hms.services.adminmanagement.model.ChargeTypeDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_ChargeCategoryRepository extends JpaRepository<HMS_TW_ChargeCategory, String> {

    List<HMS_TW_ChargeCategory> findAllByIsActiveTrue();

    Optional<HMS_TW_ChargeCategory> findByCategoryIdAndIsActiveTrue(String workId);

    ChargeTypeDTO findAllByChargeTypeIdAndIsActiveTrue(String chargeTypeId);
}



