package com.hms.services.bloodbankmanagement.controller;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_BloodDonorDetails;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_DonorDetails;
import com.hms.services.bloodbankmanagement.service.DonorDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/donors")
public class DonorDetailsController {

    @Autowired
    private DonorDetailsService donorDetailsService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_DonorDetails> createDonor(@RequestBody HMS_TM_DonorDetails donor) {
        HMS_TM_DonorDetails createdDonor = donorDetailsService.createDonor(donor);
        return new ResponseEntity<>(createdDonor, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public List<HMS_TM_DonorDetails> getAllDonors() {
        return donorDetailsService.getAllDonors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_DonorDetails> getDonorById(@PathVariable String id) {
        Optional<HMS_TM_DonorDetails> donor = donorDetailsService.getDonorById(id);
        return donor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_DonorDetails> updateDonor(@PathVariable String id, @RequestBody HMS_TM_DonorDetails donor) {
        HMS_TM_DonorDetails updatedDonor = donorDetailsService.updateDonor(id, donor);
        return updatedDonor != null ? ResponseEntity.ok(updatedDonor) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonor(@PathVariable String id) {
        try {
            HMS_TM_DonorDetails deletedBloodDonor = donorDetailsService.deleteDonor(id);
            return deletedBloodDonor != null
                    ? ResponseEntity.ok("Blood Donor marked as deleted successfully.")
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blood Donor not found.");
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing request. Please try again.", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<HMS_TM_DonorDetails>> searchDonors(
            @RequestParam String donorName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<HMS_TM_DonorDetails> donors = donorDetailsService.searchDonorsByName(donorName, page, size);
        return ResponseEntity.ok(donors);
    }

}


