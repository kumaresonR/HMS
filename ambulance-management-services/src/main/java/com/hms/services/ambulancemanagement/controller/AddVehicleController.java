package com.hms.services.ambulancemanagement.controller;


import com.hms.services.ambulancemanagement.entity.HMS_TM_AddVehicle;
import com.hms.services.ambulancemanagement.service.AddVehicleService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ambulance_vehicle")
public class AddVehicleController {

    private final AddVehicleService vehicleService;

    @Autowired
    public AddVehicleController(final AddVehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // Add a new vehicle
    @PostMapping("/add")
    public ResponseEntity<HMS_TM_AddVehicle> addVehicle(
            @RequestBody HMS_TM_AddVehicle vehicle) {
        HMS_TM_AddVehicle savedVehicle = vehicleService.addVehicle(vehicle);
        return ResponseEntity.ok(savedVehicle);
    }

    // Get all vehicles
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_AddVehicle>> getAllVehicles() {
        List<HMS_TM_AddVehicle> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }

    // Get a specific vehicle by ID
    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_AddVehicle> getVehicleById(@PathVariable String id) {
        Optional<HMS_TM_AddVehicle> vehicle = vehicleService.getVehicleById(id);
        return vehicle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update an existing vehicle
    @PutMapping("/update/{id}")
    public ResponseEntity<HMS_TM_AddVehicle> updateVehicle(
            @PathVariable String id,
            @RequestBody HMS_TM_AddVehicle vehicle) {
        HMS_TM_AddVehicle updatedVehicle = vehicleService.updateVehicle(id, vehicle);
        return ResponseEntity.ok(updatedVehicle);
    }

    // Delete a vehicle by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<JSONObject> deleteVehicle(@PathVariable String id) {
        JSONObject response = vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(response);
    }


}


