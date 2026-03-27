package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_BedDetails;
import com.hms.services.adminmanagement.entity.HMS_TW_BedDetails;
import com.hms.services.adminmanagement.model.BedDetailsDTO;
import com.hms.services.adminmanagement.service.BedDetailsService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bed-details")
public class BedDetailsController {

    private final BedDetailsService bedDetailsService;

    @Autowired
    public BedDetailsController(BedDetailsService bedDetailsService) {
        this.bedDetailsService = bedDetailsService;
    }

    @PostMapping("/work-table")
    public ResponseEntity<HMS_TW_BedDetails> createWorkEntry(@RequestBody HMS_TW_BedDetails bedDetails) {
        return ResponseEntity.ok(bedDetailsService.createInWorkTable(bedDetails));
    }

    @PatchMapping("/{id}/authorize")
    public ResponseEntity<HMS_TW_BedDetails> updateAuthStat(
            @PathVariable("id") String id,
            @RequestParam("authStat") String authStat) {
        HMS_TW_BedDetails updatedBedDetails = bedDetailsService.updateAuthStatById(id, authStat);
        return ResponseEntity.ok(updatedBedDetails);
    }

    @PutMapping("/work-table/{id}")
    public ResponseEntity<HMS_TW_BedDetails> approveWorkEntry(@PathVariable String id, @RequestBody HMS_TW_BedDetails bedDetails) {
        return ResponseEntity.ok(bedDetailsService.approveWorkTableEntry(id, bedDetails));
    }

    @GetMapping("/master-table")
    public ResponseEntity<List<BedDetailsDTO>> getAllMasterEntries(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        return ResponseEntity.ok(bedDetailsService.getAllMasterEntries(page, size));
    }

    @GetMapping("/work-table")
    public ResponseEntity<List<BedDetailsDTO>> getAllWorkEntries(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        return ResponseEntity.ok(bedDetailsService.getAllWorkEntries(page, size));
    }

    @GetMapping("/room_details/{bedDetailsId}")
    public ResponseEntity<BedDetailsDTO> getAllRoomEntries(@PathVariable ("bedDetailsId") String id) {
        return ResponseEntity.ok(bedDetailsService.getAllRoomEntries(id));
    }

    @DeleteMapping("/work-table/{id}")
    public JSONObject softDeleteWorkEntry(@PathVariable String id) {
        return bedDetailsService.softDeleteWorkTableEntry(id);
    }

    @DeleteMapping("/master-table/{id}")
    public JSONObject softDeleteMasterEntry(@PathVariable String id) {
        return bedDetailsService.softDeleteMasterTableEntry(id);
    }

    @GetMapping("/room_number/{bedGroupId}")
    public ResponseEntity<List<HMS_TM_BedDetails>> getAllRoomNumber(@PathVariable ("bedGroupId") String id) {
        return ResponseEntity.ok(bedDetailsService.getAllRoomNumber(id));
    }

    @PostMapping("/{bedDetailsId}")
    public void getUpdateRoomEntries(
            @PathVariable("bedDetailsId") String id,
            @RequestParam("status") boolean status) {
            bedDetailsService.getUpdateRoom(id,status);
    }

}



