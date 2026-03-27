package com.hms.services.ipdmanagement.controller;

import com.hms.services.ipdmanagement.entity.HMS_TM_IPDChargesType;
import com.hms.services.ipdmanagement.model.IPDChargesTypeDTO;
import com.hms.services.ipdmanagement.service.ChargeTypeService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/chargeType")
public class IPDChargeTypeController {

    private final ChargeTypeService chargeTypeService;

    @Autowired
    public IPDChargeTypeController(final ChargeTypeService chargeTypeService) {
        this.chargeTypeService = chargeTypeService;
    }


    @PostMapping("/all_types")
    public ResponseEntity<JSONObject> createIPDChargesType(@RequestBody IPDChargesTypeDTO ipdChargesTypeDTO) {
        chargeTypeService.createIPDChargesTypeWithDetails(ipdChargesTypeDTO);
        JSONObject obj=new JSONObject();
        obj.put("Message","IPD Charges Type with Categories and Names created successfully");
        return new ResponseEntity<>(obj, HttpStatus.CREATED);
    }

    @PutMapping("/all_types/{chargeTypeId}")
    public ResponseEntity<JSONObject> updateIPDChargeType(@PathVariable String chargeTypeId, @RequestBody IPDChargesTypeDTO ipdChargesTypeDTO) {
        Optional<HMS_TM_IPDChargesType> updatedChargeType = chargeTypeService.updateIPDChargesTypeWithDetails(chargeTypeId, ipdChargesTypeDTO);
        if (updatedChargeType.isPresent()) {
            JSONObject obj=new JSONObject();
            obj.put("Message","IPD Charges Type with Categories and Names updated successfully.");
            return new ResponseEntity<>(obj, HttpStatus.OK);
        } else {
            JSONObject obj=new JSONObject();
            obj.put("Message","IPD Charges Type not found.");
            return new ResponseEntity<>(obj, HttpStatus.NOT_FOUND);
        }

    }

    // Create a new ChargeType
    @PostMapping("/add")
    public ResponseEntity<HMS_TM_IPDChargesType> createChargeType(@RequestBody HMS_TM_IPDChargesType chargeType) {
        HMS_TM_IPDChargesType createdChargeType = chargeTypeService.createChargeType(chargeType);
        return ResponseEntity.ok(createdChargeType);
    }

    // Get a ChargeType by ID
    @GetMapping("/{chargeTypeId}")
    public ResponseEntity<HMS_TM_IPDChargesType> getChargeTypeById(@PathVariable String chargeTypeId) {
        HMS_TM_IPDChargesType chargeType = chargeTypeService.getChargeTypeById(chargeTypeId);
        return ResponseEntity.ok(chargeType);
    }

    // Get all ChargeTypes
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_IPDChargesType>> getAllChargeTypes() {
        List<HMS_TM_IPDChargesType> chargeTypes = chargeTypeService.getAllChargeTypes();
        return ResponseEntity.ok(chargeTypes);
    }

    // Update a ChargeType
    @PutMapping("/{chargeTypeId}")
    public ResponseEntity<HMS_TM_IPDChargesType> updateChargeType(@PathVariable String chargeTypeId, @RequestBody HMS_TM_IPDChargesType chargeType) {
        HMS_TM_IPDChargesType updatedChargeType = chargeTypeService.updateChargeType(chargeTypeId, chargeType);
        return ResponseEntity.ok(updatedChargeType);
    }

    // Soft delete a ChargeType
    @DeleteMapping("/{chargeTypeId}")
    public ResponseEntity<Void> softDeleteChargeType(@PathVariable String chargeTypeId) {
        chargeTypeService.softDeleteChargeType(chargeTypeId);
        return ResponseEntity.noContent().build();
    }






}

