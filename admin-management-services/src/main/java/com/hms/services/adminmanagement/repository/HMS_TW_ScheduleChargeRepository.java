package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TW_ScheduleCharge;
import com.hms.services.adminmanagement.model.ScheduleChargeDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_ScheduleChargeRepository extends JpaRepository<HMS_TW_ScheduleCharge, String> {
    void deleteByChargeId(String workId);

    List<HMS_TW_ScheduleCharge> findAllByChargeIdAndIsActiveTrue(String chargeId);

    List<HMS_TW_ScheduleCharge> findByIdAndIsActiveTrue(String insuranceId);
}



