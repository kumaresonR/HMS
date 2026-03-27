package com.hms.services.opdmanagement.repository;


import com.hms.services.opdmanagement.entity.HMS_TM_OPDVitals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VitalsRepository extends JpaRepository<HMS_TM_OPDVitals, String> {
    List<HMS_TM_OPDVitals> findByOpdId(String ipdId);

//    Optional<HMS_TM_OPDVitals> findByOpdId(String opdId);
}
