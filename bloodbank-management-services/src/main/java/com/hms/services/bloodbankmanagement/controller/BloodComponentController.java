package com.hms.services.bloodbankmanagement.controller;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_BloodComponent;
import com.hms.services.bloodbankmanagement.service.BloodComponentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blood-component")
public class BloodComponentController {

    @Autowired
    private BloodComponentService bloodComponentService;

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TM_BloodComponent>> createBloodComponents(@RequestBody List<HMS_TM_BloodComponent> bloodComponents) {
        List<HMS_TM_BloodComponent> createdComponents = bloodComponentService.createBloodComponent(bloodComponents);
        return new ResponseEntity<>(createdComponents, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_BloodComponent>> getAllBloodComponents() {
        List<HMS_TM_BloodComponent> components = bloodComponentService.getAllBloodComponents();
        return new ResponseEntity<>(components, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBloodComponent(@PathVariable String id) {
        try {
            HMS_TM_BloodComponent deletedBloodComponent = bloodComponentService.softDeleteBloodComponent(id);
            return deletedBloodComponent != null
                    ? ResponseEntity.ok("Blood Component marked as deleted successfully.")
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blood Component not found.");
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing request. Please try again.", HttpStatus.BAD_REQUEST);
        }
    }
}



