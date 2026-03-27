package com.hms.services.bloodbankmanagement.repository;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_BloodComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodComponentRepository extends JpaRepository<HMS_TM_BloodComponent, String> {
    List<HMS_TM_BloodComponent> findByDeletedFalse();

}



