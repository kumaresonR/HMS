package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_IncomeHead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_IncomeHeadRepository extends JpaRepository<HMS_TW_IncomeHead, String> {

    Optional<HMS_TW_IncomeHead> findByIdAndDeletedFalse(String id);

    List<HMS_TW_IncomeHead> findByDeletedFalse();
}




