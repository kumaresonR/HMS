package com.hms.services.ambulancemanagement.repository;

import com.hms.services.ambulancemanagement.entity.HMS_TM_AddVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddVehicleRepository extends JpaRepository<HMS_TM_AddVehicle, String> {

    List<HMS_TM_AddVehicle> findAllByIsActiveTrue();

    Optional<HMS_TM_AddVehicle> findByVehicleIdAndIsActiveTrue(String vehicleId);


}


