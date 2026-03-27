package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_FloorRepository extends JpaRepository<HMS_TW_Floor, String> {
    Optional<HMS_TW_Floor> findByFloorIdAndIsActiveTrue(String workId);
    List<HMS_TW_Floor> findAllByIsActiveTrue();

}



