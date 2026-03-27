package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_AddReferralPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TM_ReferralPersonRepository extends JpaRepository<HMS_TM_AddReferralPerson, String> {

    List<HMS_TM_AddReferralPerson> findAllByIsActiveTrue();

    Optional<HMS_TM_AddReferralPerson> findByPersonIdAndIsActiveTrue(String id);
}


