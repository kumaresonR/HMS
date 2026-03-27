package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDChargesName;
import com.hms.services.ipdmanagement.service.IPDChargesNameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ipd-charges-name")
public class IPDChargesNameController {

    private final IPDChargesNameService chargesNameService;

    @Autowired
    public IPDChargesNameController(IPDChargesNameService chargesNameService) {
        this.chargesNameService = chargesNameService;
    }

    // POST: Create a new charge name
    @PostMapping("/add")
    public ResponseEntity<HMS_TM_IPDChargesName> createChargeName(@RequestBody HMS_TM_IPDChargesName chargeName) {
        return ResponseEntity.ok(chargesNameService.createChargeName(chargeName));
    }

    // GET by chargeCategoryId: Retrieve charges by category ID
    @GetMapping("/category/{chargeCategoryId}")
    public ResponseEntity<List<HMS_TM_IPDChargesName>> getChargesByCategoryId(@PathVariable String chargeCategoryId) {
        return ResponseEntity.ok(chargesNameService.getChargesByCategoryId(chargeCategoryId));
    }

    // GET all: Retrieve all active charges
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_IPDChargesName>> getAllCharges() {
        return ResponseEntity.ok(chargesNameService.getAllCharges());
    }

    @GetMapping("/{chargeNameId}")
    public ResponseEntity<HMS_TM_IPDChargesName> getByChargeNameId(@PathVariable String chargeNameId) {
        return ResponseEntity.ok(chargesNameService.getChargesByChargeNameId(chargeNameId));
    }

    // PUT: Update an existing charge name by ID
    @PutMapping("/{chargeNameId}")
    public ResponseEntity<HMS_TM_IPDChargesName> updateChargeName(
            @PathVariable String chargeNameId,
            @RequestBody HMS_TM_IPDChargesName updatedChargeName) {
        return ResponseEntity.ok(chargesNameService.updateChargeName(chargeNameId, updatedChargeName));
    }

    // DELETE (soft delete): Deactivate a charge name by ID
    @DeleteMapping("/{chargeNameId}")
    public ResponseEntity<Void> softDeleteChargeName(@PathVariable String chargeNameId) {
        chargesNameService.softDeleteChargeName(chargeNameId);
        return ResponseEntity.noContent().build();
    }

}

