package com.hms.services.ipdmanagement.repository;


import com.hms.services.ipdmanagement.entity.HMS_TM_BedGroup;
import com.hms.services.ipdmanagement.entity.HMS_TM_PostnatalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostnatalHistoryRepository extends JpaRepository<HMS_TM_PostnatalHistory, String> {
    List<HMS_TM_PostnatalHistory> findByIpdIdAndIsActiveTrue(String ipdId);

    Optional<HMS_TM_PostnatalHistory> findByPostnatalIdAndIsActiveTrue(String postnatalId);
}

