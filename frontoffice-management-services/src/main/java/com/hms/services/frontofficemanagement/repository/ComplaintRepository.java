package com.hms.services.frontofficemanagement.repository;

import com.hms.services.frontofficemanagement.entity.HMS_TM_Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ComplaintRepository extends JpaRepository<HMS_TM_Complaint, UUID> {

}


