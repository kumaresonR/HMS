package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_AddReferralPerson;
import com.hms.services.adminmanagement.service.ReferralPersonService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/referral-person")
public class ReferralManagementController {


    private final ReferralPersonService referralPersonService;

    @Autowired
    public ReferralManagementController(ReferralPersonService referralPersonService) {
        this.referralPersonService = referralPersonService;
    }

    // Create Referral Person
    @PostMapping("/add")
    public ResponseEntity<HMS_TM_AddReferralPerson> createReferralPerson(@RequestBody HMS_TM_AddReferralPerson referralPerson) {
        HMS_TM_AddReferralPerson createdPerson = referralPersonService.createReferralPerson(referralPerson);
        return new ResponseEntity<>(createdPerson, HttpStatus.CREATED);
    }

    // Update Referral Person
    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_AddReferralPerson> updateReferralPerson(@PathVariable String id, @RequestBody HMS_TM_AddReferralPerson referralPerson) {
        HMS_TM_AddReferralPerson updatedPerson = referralPersonService.updateReferralPerson(id, referralPerson);
        return new ResponseEntity<>(updatedPerson, HttpStatus.OK);
    }

    // Delete Referral Person (Soft Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<JSONObject> deleteReferralPerson(@PathVariable String id) {
        referralPersonService.deleteReferralPerson(id);
        JSONObject response = new JSONObject();
        response.put("status", "Referral Person Deleted Successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Get All Active Referral Persons
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_AddReferralPerson>> getAllActiveReferralPersons() {
        return new ResponseEntity<>(referralPersonService.getAllActiveReferralPersons(), HttpStatus.OK);
    }

    // Get Referral Person by ID
    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_AddReferralPerson> getReferralPersonById(@PathVariable String id) {
        return new ResponseEntity<>(referralPersonService.getReferralPersonById(id), HttpStatus.OK);
    }









}



