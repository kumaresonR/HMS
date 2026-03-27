package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_AddMedicineGroup;
import com.hms.services.adminmanagement.entity.HMS_TW_AddMedicineGroup;
import com.hms.services.adminmanagement.service.AddMedicineGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/medicine-groups")
public class AddMedicineGroupController {

    @Autowired
    private AddMedicineGroupService addMedicineGroupService;

    @PostMapping("/create")
    public ResponseEntity<List<HMS_TW_AddMedicineGroup>> createMedicineGroups(@Valid @RequestBody List<HMS_TW_AddMedicineGroup> medicineGroups) {
        List<HMS_TW_AddMedicineGroup> createdMedicineGroups = addMedicineGroupService.createMedicineGroups(medicineGroups);
        return ResponseEntity.ok(createdMedicineGroups);
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_AddMedicineGroup> getMedicineGroupById(@PathVariable String id) {
        HMS_TW_AddMedicineGroup medicineGroup = addMedicineGroupService.getMedicineGroupById(id);
        if (medicineGroup != null) {
            return ResponseEntity.ok(medicineGroup);
        } else {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_AddMedicineGroup>> getAllMedicineGroupsTW() {
        List<HMS_TW_AddMedicineGroup> medicineGroups = addMedicineGroupService.getAllMedicineGroupsTW();
        return ResponseEntity.ok(medicineGroups);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_AddMedicineGroup> updateMedicineGroup(
            @PathVariable String id,
            @Valid @RequestBody HMS_TW_AddMedicineGroup medicineGroup) {
        return ResponseEntity.ok(addMedicineGroupService.updateMedicineGroup(id, medicineGroup));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TW_AddMedicineGroup> approveMedicineGroup(
            @PathVariable String id) {
        return ResponseEntity.ok(addMedicineGroupService.approveMedicineGroup(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicineGroup(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            addMedicineGroupService.deleteMedicineGroup(id, authStat);
            return ResponseEntity.ok("Medicine Group deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Medicine group not found or cannot be deleted.");
        }
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_AddMedicineGroup> updateMedicineGroup(
            @PathVariable String id,
            @Valid @RequestBody HMS_TM_AddMedicineGroup medicineGroup) {
        return ResponseEntity.ok(addMedicineGroupService.updateMedicineGroup(id, medicineGroup));
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_AddMedicineGroup> getMedicineGroupByIds(@PathVariable String id) {
        return ResponseEntity.ok(addMedicineGroupService.getMedicineGroupByIds(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_AddMedicineGroup>> getAllMedicineGroupsTM() {
        List<HMS_TM_AddMedicineGroup> medicineGroups = addMedicineGroupService.getAllMedicineGroupsTM();
        return ResponseEntity.ok(medicineGroups);
    }

    @DeleteMapping("/tw/remove/{id}")
    public ResponseEntity<String> deleteTwMedicineGroup(@PathVariable String id) {
        try {
            addMedicineGroupService.deleteTwMedicineGroup(id);
            return ResponseEntity.ok("Medicine group marked as deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Medicine group not found or cannot be deleted.");
        }
    }
}



