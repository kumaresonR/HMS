package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TM_Floor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HMS_TM_FloorRepository extends JpaRepository<HMS_TM_Floor, String> {
    List<HMS_TM_Floor> findAllByIsActiveTrue();

    Optional<HMS_TM_Floor> findByFloorIdAndIsActiveTrue(String floorId);

    Optional<HMS_TM_Floor> findByWtIdAndIsActiveTrue(String id);
}



