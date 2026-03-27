package com.hms.services.frontofficemanagement.repository;

import com.hms.services.frontofficemanagement.entity.HMS_TM_Complaint;
import com.hms.services.frontofficemanagement.entity.HMS_TM_PhoneCallLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PhoneCallLogRepository extends JpaRepository<HMS_TM_PhoneCallLog, UUID> {

}


