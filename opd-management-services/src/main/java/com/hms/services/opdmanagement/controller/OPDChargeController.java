package com.hms.services.opdmanagement.controller;


import com.hms.services.opdmanagement.entity.HMS_TM_OPDCharges;
import com.hms.services.opdmanagement.service.OPDChargesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/opd-charges")
public class OPDChargeController {


    private final OPDChargesService opdChargesService;

    @Autowired
    public OPDChargeController(final OPDChargesService opdChargesService) {
        this.opdChargesService = opdChargesService;
    }

    @PostMapping("/add")
    public ResponseEntity<List<HMS_TM_OPDCharges>> createOPDCharges(@Valid @RequestBody List<HMS_TM_OPDCharges> opdCharges) {
        List<HMS_TM_OPDCharges> createdCharges = opdChargesService.createOPDCharges(opdCharges);
        return new ResponseEntity<>(createdCharges, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_OPDCharges> updateOPDCharge(@PathVariable String id, @Valid @RequestBody HMS_TM_OPDCharges opdCharge) {
        HMS_TM_OPDCharges updatedCharge = opdChargesService.updateOPDCharge(id, opdCharge);
        return new ResponseEntity<>(updatedCharge, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOPDCharge(@PathVariable String id) {
        opdChargesService.deleteOPDCharge(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_OPDCharges>> getAllActiveOPDCharges() {
        return new ResponseEntity<>(opdChargesService.getAllActiveOPDCharges(), HttpStatus.OK);
    }

    @GetMapping("/by-opd/{opdId}")
    public ResponseEntity<List<HMS_TM_OPDCharges>> getOPDChargesByIpdId(@PathVariable String opdId) {
        return new ResponseEntity<>(opdChargesService.getOPDChargesByOpdId(opdId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_OPDCharges> getOPDChargeByOpdChargeId(@PathVariable String id) {
        return new ResponseEntity<>(opdChargesService.getOPDChargeByOpdChargeId(id), HttpStatus.OK);
    }


}

