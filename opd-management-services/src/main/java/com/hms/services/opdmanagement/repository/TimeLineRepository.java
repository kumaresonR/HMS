package com.hms.services.opdmanagement.repository;


import com.hms.services.opdmanagement.entity.HMS_TM_OPDTimeLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimeLineRepository extends JpaRepository<HMS_TM_OPDTimeLine, String> {


    Optional<HMS_TM_OPDTimeLine> findByTimeLineIdAndIsActiveTrue(String timeLineId);

    List<HMS_TM_OPDTimeLine> findByOpdIdAndIsActiveTrue(String ipdId);

    List<HMS_TM_OPDTimeLine> findAllByIsActiveTrue();
}

