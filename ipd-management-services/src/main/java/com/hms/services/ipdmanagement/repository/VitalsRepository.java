package com.hms.services.ipdmanagement.repository;

import com.hms.services.ipdmanagement.entity.HMS_TM_Vitals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VitalsRepository extends JpaRepository<HMS_TM_Vitals, String> {
    List<HMS_TM_Vitals> findByIpdId(String ipdId);
}
