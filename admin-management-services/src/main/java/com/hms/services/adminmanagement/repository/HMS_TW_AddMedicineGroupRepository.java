package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_AddMedicineGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_AddMedicineGroupRepository extends JpaRepository<HMS_TW_AddMedicineGroup, String> {

    List<HMS_TW_AddMedicineGroup> findByDeletedFalse();

    Optional<HMS_TW_AddMedicineGroup> findByIdAndDeletedFalse(String id);
}



