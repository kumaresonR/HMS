package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_TPADetails;
import com.hms.services.adminmanagement.service.TpaDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.json.simple.JSONObject;
import java.util.List;

@RestController
@RequestMapping("/tpa-details")
public class TPAManagementController {

    private final TpaDetailsService tpaDetailsService;

    @Autowired
    public TPAManagementController(TpaDetailsService tpaDetailsService) {
        this.tpaDetailsService = tpaDetailsService;
    }

    // Create TPA Details
    @PostMapping("/add")
    public ResponseEntity<List<HMS_TM_TPADetails>> createTpaDetails(@Valid @RequestBody List<HMS_TM_TPADetails> tpaDetailsList) {
        List<HMS_TM_TPADetails> createdDetails = tpaDetailsService.createTpaDetails(tpaDetailsList);
        return new ResponseEntity<>(createdDetails, HttpStatus.CREATED);
    }

    // Update TPA Details
    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_TPADetails> updateTpaDetails(@PathVariable String id, @Valid @RequestBody HMS_TM_TPADetails tpaDetails) {
        HMS_TM_TPADetails updatedDetails = tpaDetailsService.updateTpaDetails(id, tpaDetails);
        return new ResponseEntity<>(updatedDetails, HttpStatus.OK);
    }

    // Delete TPA Details
    @DeleteMapping("/{id}")
    public ResponseEntity<JSONObject> deleteTpaDetails(@PathVariable String id) {
        tpaDetailsService.deleteTpaDetails(id);
        JSONObject response = new JSONObject();
        response.put("status", "TPA Details Deleted Successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Get All Active TPA Details
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_TPADetails>> getAllActiveTpaDetails() {
        return new ResponseEntity<>(tpaDetailsService.getAllActiveTpaDetails(), HttpStatus.OK);
    }

    // Get TPA Details by ID
    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_TPADetails> getTpaDetailsById(@PathVariable String id) {
        return new ResponseEntity<>(tpaDetailsService.getTpaDetailsById(id), HttpStatus.OK);
    }

}



