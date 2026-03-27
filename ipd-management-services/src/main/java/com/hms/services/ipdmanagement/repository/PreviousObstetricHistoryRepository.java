package com.hms.services.ipdmanagement.repository;

import com.hms.services.ipdmanagement.entity.HMS_TM_PreviousObstetricHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PreviousObstetricHistoryRepository extends JpaRepository<HMS_TM_PreviousObstetricHistory, String> {


    List<HMS_TM_PreviousObstetricHistory> findAllByIsActiveTrue();

    Optional<HMS_TM_PreviousObstetricHistory> findByHistoryIdAndIsActiveTrue(String historyId);

    List<HMS_TM_PreviousObstetricHistory> findByIpdIdAndIsActiveTrue(String ipdId);
}

