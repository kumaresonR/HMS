package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_BedGroup;
import com.hms.services.adminmanagement.entity.HMS_TW_BedGroup;
import com.hms.services.adminmanagement.model.BedGroupDTO;
import com.hms.services.adminmanagement.model.BedGroupFloorDTO;
import com.hms.services.adminmanagement.service.BedGroupService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bed-group")
public class BedGroupController {


    private final BedGroupService bedGroupService;

    @Autowired
    public BedGroupController(final BedGroupService bedGroupService) {
        this.bedGroupService = bedGroupService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<HMS_TW_BedGroup> createWorkEntry(@RequestBody HMS_TW_BedGroup twBedGroup) {
        return ResponseEntity.ok(bedGroupService.createInWorkTable(twBedGroup));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_BedGroup> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_BedGroup updatedBedGroup = bedGroupService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedBedGroup);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_BedGroup> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_BedGroup twBedGroup) {
        return ResponseEntity.ok(bedGroupService.approveWorkTableEntry(id, twBedGroup));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<BedGroupFloorDTO>> getAllMasterEntries( @RequestParam(defaultValue = "0") Integer page,
                                                                         @RequestParam(defaultValue = "10") Integer size) {
        return ResponseEntity.ok(bedGroupService.getAllMasterEntries(page, size));
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<BedGroupFloorDTO>> getAllWorkEntries(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        return ResponseEntity.ok(bedGroupService.getAllWorkEntries(page, size));
    }

    @DeleteMapping("/work-table/{id}")
    public ResponseEntity<JSONObject> softDeleteWorkBedGroup(@PathVariable String id) {
        return ResponseEntity.ok(bedGroupService.softDeleteWorkBedGroup(id));
    }

    @DeleteMapping("/master-table/{id}")
    public ResponseEntity<JSONObject> softDeleteMasterBedGroup(@PathVariable String id) {
        return ResponseEntity.ok(bedGroupService.softDeleteMasterBedGroup(id));
    }


    @GetMapping("/bed-group-name")
    public ResponseEntity<List<BedGroupDTO>> getAllMasterEntriesName() {
        return ResponseEntity.ok(bedGroupService.getAllMasterEntriesName());
    }

}



