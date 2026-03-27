package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_UnitType;
import com.hms.services.adminmanagement.entity.HMS_TW_UnitType;
import com.hms.services.adminmanagement.service.UnitTypeService;
import jakarta.validation.Valid;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/unit-type")
public class UnitTypeController {


    private final UnitTypeService unitTypeService;

    @Autowired
    public UnitTypeController(final UnitTypeService unitTypeService) {
        this.unitTypeService = unitTypeService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<HMS_TW_UnitType> createWorkEntry(@Valid @RequestBody HMS_TW_UnitType twUnitType) {
        return ResponseEntity.ok(unitTypeService.createInWorkTable(twUnitType));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_UnitType> updateAuthStatForUnitType(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_UnitType updatedUnitType = unitTypeService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedUnitType);
    }


    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_UnitType> approveWorkEntry(@PathVariable String id,@Valid @RequestBody HMS_TW_UnitType twUnitType) {
        return ResponseEntity.ok(unitTypeService.approveWorkTableEntry(id,twUnitType));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_UnitType>> getAllMasterEntries() {
        return ResponseEntity.ok(unitTypeService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_UnitType>> getAllWorkEntries() {
        return ResponseEntity.ok(unitTypeService.getAllWorkEntries());
    }

    @DeleteMapping("/work-table/{unitTypeId}")
    public ResponseEntity<JSONObject> softDeleteWorkUnitType(@PathVariable String unitTypeId) {
        return ResponseEntity.ok(unitTypeService.softDeleteWorkUnitType(unitTypeId));
    }



}



