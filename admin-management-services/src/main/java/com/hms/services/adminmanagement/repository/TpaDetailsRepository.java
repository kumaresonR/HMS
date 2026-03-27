package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_TPADetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TpaDetailsRepository extends JpaRepository<HMS_TM_TPADetails, String> {


    Optional<HMS_TM_TPADetails> findByIdAndIsActiveTrue(String id);

    List<HMS_TM_TPADetails> findAllByIsActiveTrue();
}



