package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_Floor;
import com.hms.services.adminmanagement.entity.HMS_TW_Floor;
import com.hms.services.adminmanagement.service.FloorService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/floor")
public class FloorController {

    private final FloorService floorService;

    @Autowired
    public FloorController(final FloorService floorService) {
        this.floorService = floorService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<HMS_TW_Floor> createWorkEntry(@RequestBody HMS_TW_Floor twFloor) {
        return ResponseEntity.ok(floorService.createInWorkTable(twFloor));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_Floor> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_Floor updatedFloor = floorService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedFloor);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_Floor> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_Floor twFloor) {
        return ResponseEntity.ok(floorService.approveWorkTableEntry(id, twFloor));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<HMS_TM_Floor>> getAllMasterEntries() {
        return ResponseEntity.ok(floorService.getAllMasterEntries());
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<HMS_TW_Floor>> getAllWorkEntries() {
        return ResponseEntity.ok(floorService.getAllWorkEntries());
    }

    // Endpoint to soft delete a work floor
    @DeleteMapping("/work-table/{floorId}")
    public ResponseEntity<JSONObject> softDeleteWorkFloor(@PathVariable String floorId) {
        return ResponseEntity.ok(floorService.softDeleteWorkFloor(floorId));
    }

    // Endpoint to soft delete a master floor
    @DeleteMapping("/master-table/{floorId}")
    public ResponseEntity<JSONObject> softDeleteMasterFloor(@PathVariable String floorId) {
        return ResponseEntity.ok(floorService.softDeleteMasterFloor(floorId));
    }


}



