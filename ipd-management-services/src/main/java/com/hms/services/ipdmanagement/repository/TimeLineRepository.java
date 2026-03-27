package com.hms.services.ipdmanagement.repository;

import com.hms.services.ipdmanagement.entity.HMS_TM_TimeLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimeLineRepository extends JpaRepository<HMS_TM_TimeLine, String> {


    Optional<HMS_TM_TimeLine> findByTimeLineIdAndIsActiveTrue(String timeLineId);

    List<HMS_TM_TimeLine> findByIpdIdAndIsActiveTrue(String ipdId);

}

