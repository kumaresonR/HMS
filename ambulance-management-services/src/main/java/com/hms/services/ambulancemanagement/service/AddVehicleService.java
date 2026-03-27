package com.hms.services.ambulancemanagement.service;


import com.hms.services.ambulancemanagement.entity.HMS_TM_AddVehicle;
import com.hms.services.ambulancemanagement.exception.CustomException;
import com.hms.services.ambulancemanagement.repository.AddVehicleRepository;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AddVehicleService {

    private final AddVehicleRepository vehicleRepository;

    @Autowired
    public AddVehicleService(final AddVehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    // Add a new vehicle
    public HMS_TM_AddVehicle addVehicle(HMS_TM_AddVehicle vehicle) {
        try {
            vehicle.setActive(true);
            vehicle.setCreatedAt(LocalDateTime.now());
            vehicle.setCreatedBy("createdBy");
            vehicle.setLastModifiedBy("createdBy");
            vehicle.setLastModifiedAt(LocalDateTime.now());
            return vehicleRepository.save(vehicle);
        }catch (Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);

        }
    }

    // Get all active vehicles
    public List<HMS_TM_AddVehicle> getAllVehicles() {
        return vehicleRepository.findAllByIsActiveTrue();
    }

    // Get vehicle by ID
    public Optional<HMS_TM_AddVehicle> getVehicleById(String id) {
        return vehicleRepository.findByVehicleIdAndIsActiveTrue(id);
    }

    // Update an existing vehicle
    public HMS_TM_AddVehicle updateVehicle(String id, HMS_TM_AddVehicle vehicle) {
        try {
            Optional<HMS_TM_AddVehicle> existingVehicleOpt = vehicleRepository.findByVehicleIdAndIsActiveTrue(id);
            if (existingVehicleOpt.isPresent()) {
                HMS_TM_AddVehicle existingVehicle = existingVehicleOpt.get();
                // Update fields
                existingVehicle.setVehicleNumber(vehicle.getVehicleNumber());
                existingVehicle.setVehicleModel(vehicle.getVehicleModel());
                existingVehicle.setYearMade(vehicle.getYearMade());
                existingVehicle.setDriverName(vehicle.getDriverName());
                existingVehicle.setDriverLicense(vehicle.getDriverLicense());
                existingVehicle.setDriverContact(vehicle.getDriverContact());
                existingVehicle.setVehicleType(vehicle.getVehicleType());
                existingVehicle.setNote(vehicle.getNote());
                existingVehicle.setLastModifiedBy("lastModifiedBy");
                existingVehicle.setLastModifiedAt(LocalDateTime.now());
                return vehicleRepository.save(existingVehicle);
            } else {
                throw new RuntimeException("Vehicle not found for ID: " + id);
            }
        }catch (Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);

        }
    }

    // Delete a vehicle by ID
    public JSONObject deleteVehicle(String id) {
        Optional<HMS_TM_AddVehicle> existingVehicleOpt = vehicleRepository.findByVehicleIdAndIsActiveTrue(id);
        if (existingVehicleOpt.isPresent()) {
            HMS_TM_AddVehicle vehicle = existingVehicleOpt.get();
            vehicle.setActive(false);
            vehicleRepository.save(vehicle);
            JSONObject obj = new JSONObject();
            obj.put("Message", "Vehicle with ID: " + id + " has been deleted successfully.");
            return obj;
        } else {
            throw new RuntimeException("Vehicle not found for ID: " + id);
        }
    }
}


