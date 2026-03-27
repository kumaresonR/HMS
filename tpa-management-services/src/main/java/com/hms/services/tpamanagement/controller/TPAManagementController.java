package com.hms.services.tpamanagement.controller;



import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.tpamanagement.entity.HMS_TM_TPADetails;
import com.hms.services.tpamanagement.service.TpaDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.json.simple.JSONObject;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/tpa-details")
public class TPAManagementController {

    private final TpaDetailsService tpaDetailsService;

    @Autowired
    public TPAManagementController(TpaDetailsService tpaDetailsService) {
        this.tpaDetailsService = tpaDetailsService;
    }

//    // Create TPA Details
//    @PostMapping("/add")
//    public ResponseEntity<List<HMS_TM_TPADetails>> createTpaDetails(@RequestBody List<HMS_TM_TPADetails> tpaDetailsList) {
//        List<HMS_TM_TPADetails> createdDetails = tpaDetailsService.createTpaDetails(tpaDetailsList);
//        return new ResponseEntity<>(createdDetails, HttpStatus.CREATED);
//    }
//
//    // Update TPA Details
//    @PutMapping("/{id}")
//    public ResponseEntity<HMS_TM_TPADetails> updateTpaDetails(@PathVariable String id, @RequestBody HMS_TM_TPADetails tpaDetails) {
//        HMS_TM_TPADetails updatedDetails = tpaDetailsService.updateTpaDetails(id, tpaDetails);
//        return new ResponseEntity<>(updatedDetails, HttpStatus.OK);
//    }

    @PostMapping("/add")
    public ResponseEntity<?> createTpaDetails(
            @RequestPart("tpaDetails") String tpaDetailsJson,
            @RequestPart(value = "otherDocuments", required = false) MultipartFile otherDocumentsFile) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            HMS_TM_TPADetails tpaDetails = objectMapper.readValue(tpaDetailsJson, HMS_TM_TPADetails.class);

            HMS_TM_TPADetails createdTpaDetails = tpaDetailsService.saveTpaDetails(tpaDetails, otherDocumentsFile);
            return new ResponseEntity<>(createdTpaDetails, HttpStatus.CREATED);

        } catch (IOException e) {
            return new ResponseEntity<>("Error processing request. Please check the request format.", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTpaDetails(
            @PathVariable String id,
            @RequestPart("tpaDetails") String tpaDetailsJson,
            @RequestPart(value = "otherDocuments", required = false) MultipartFile otherDocumentsFile) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            HMS_TM_TPADetails tpaDetails = objectMapper.readValue(tpaDetailsJson, HMS_TM_TPADetails.class);

            HMS_TM_TPADetails updatedTpaDetails = tpaDetailsService.updateTpaDetails(id, tpaDetails, otherDocumentsFile);

            return new ResponseEntity<>(updatedTpaDetails, HttpStatus.OK);

        } catch (IOException e) {
            return new ResponseEntity<>("Error parsing TPA details. Please check the request format.", HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("TPA details not found or cannot be updated.", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while updating TPA details.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<JSONObject> deleteTpaDetails(@PathVariable String id) {
        tpaDetailsService.deleteTpaDetails(id);
        JSONObject response = new JSONObject();
        response.put("status", "TPA Details Deleted Successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_TPADetails>> getAllActiveTpaDetails() {
        return new ResponseEntity<>(tpaDetailsService.getAllActiveTpaDetails(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_TPADetails> getTpaDetailsById(@PathVariable String id) {
        return new ResponseEntity<>(tpaDetailsService.getTpaDetailsById(id), HttpStatus.OK);
    }

}

