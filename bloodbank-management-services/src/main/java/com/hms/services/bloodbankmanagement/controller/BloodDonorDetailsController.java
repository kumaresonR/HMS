package com.hms.services.bloodbankmanagement.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_BloodDonorDetails;
import com.hms.services.bloodbankmanagement.exceptionhandler.CustomException;
import com.hms.services.bloodbankmanagement.model.BloodDonorDetailsDTO;
import com.hms.services.bloodbankmanagement.service.BloodDonorDetailsService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/blood-donor")
public class BloodDonorDetailsController {

    @Autowired
    private BloodDonorDetailsService bloodDonorDetailsService;

    @PostMapping("/generate")
    public ResponseEntity<HMS_TM_BloodDonorDetails> generateBloodDonor(
            @RequestPart("bloodData") String bloodDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {
        try {
            HMS_TM_BloodDonorDetails generatedBloodDonor = bloodDonorDetailsService.generateBloodDonor(bloodDataJson, attachmentFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(generatedBloodDonor);
        } catch (CustomException | JsonProcessingException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<BloodDonorDetailsDTO>> getAllBloodDonors() {
        List<BloodDonorDetailsDTO> donors = bloodDonorDetailsService.getAllBloodDonorsWithDonorDetails();
        return new ResponseEntity<>(donors, HttpStatus.OK);
    }

    @GetMapping("/{bloodDonorId}")
    public ResponseEntity<BloodDonorDetailsDTO> getBloodDonorById(@PathVariable String bloodDonorId) {
        BloodDonorDetailsDTO donorDetails = bloodDonorDetailsService.getBloodDonorByIdWithDonorDetails(bloodDonorId);
        return new ResponseEntity<>(donorDetails, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_BloodDonorDetails> updateBloodDonor(
            @PathVariable String id,
            @RequestPart("bloodData") String bloodDataJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachmentFile) {

        try {
            HMS_TM_BloodDonorDetails updatedBloodDonor = bloodDonorDetailsService.updateBloodDonor(id, bloodDataJson, attachmentFile);
            return updatedBloodDonor != null
                    ? ResponseEntity.ok(updatedBloodDonor)
                    : ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBloodDonor(@PathVariable String id) {
        try {
            HMS_TM_BloodDonorDetails deletedBloodDonor = bloodDonorDetailsService.softDeleteBloodDonor(id);
            return deletedBloodDonor != null
                    ? ResponseEntity.ok("Blood Donor marked as deleted successfully.")
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blood Donor not found.");
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing request. Please try again.", HttpStatus.BAD_REQUEST);
        }
    }
}



