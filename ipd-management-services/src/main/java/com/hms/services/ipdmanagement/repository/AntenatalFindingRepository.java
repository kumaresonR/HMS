package com.hms.services.ipdmanagement.repository;


import com.hms.services.ipdmanagement.entity.HMS_TM_AntenatalFinding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AntenatalFindingRepository extends JpaRepository<HMS_TM_AntenatalFinding, String> {


    List<HMS_TM_AntenatalFinding> findByIpdIdAndIsActiveTrue(String ipdId);

    Optional<HMS_TM_AntenatalFinding> findByAntenatalIdAndIsActiveTrue(String antenatalId);



}

