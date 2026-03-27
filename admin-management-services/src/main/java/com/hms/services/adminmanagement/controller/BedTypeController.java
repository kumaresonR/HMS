package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_BedType;
import com.hms.services.adminmanagement.entity.HMS_TW_BedType;
import com.hms.services.adminmanagement.service.BedTypeService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bed-type")
public class BedTypeController {

    private final BedTypeService bedTypeService;

    @Autowired
    public BedTypeController(final BedTypeService bedTypeService) {
        this.bedTypeService = bedTypeService;
    }

    // Create entry in Work Table
    @PostMapping("/work-table")
    public ResponseEntity<HMS_TW_BedType> createWorkEntry(@RequestBody HMS_TW_BedType twBedType) {
        return ResponseEntity.ok(bedTypeService.createInWorkTable(twBedType));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_BedType> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_BedType updatedBedType = bedTypeService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedBedType);
    }


    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_BedType> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_BedType twBedType) {
        return ResponseEntity.ok(bedTypeService.approveWorkTableEntry(id, twBedType));
    }

    // Get all entries from Master Table
    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_BedType>> getAllMasterEntries() {
        return ResponseEntity.ok(bedTypeService.getAllMasterEntries());
    }

    // Get all entries from Work Table
    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_BedType>> getAllWorkEntries() {
        return ResponseEntity.ok(bedTypeService.getAllWorkEntries());
    }

    @DeleteMapping("/work-table/{id}")
    public ResponseEntity<JSONObject> softDeleteWorkBedType(@PathVariable String id) {
        return ResponseEntity.ok(bedTypeService.softDeleteWorkBedType(id));
    }

    @DeleteMapping("/master-table/{id}")
    public ResponseEntity<JSONObject> softDeleteMasterBedType(@PathVariable String id) {
        return ResponseEntity.ok(bedTypeService.softDeleteMasterBedType(id));
    }
}



