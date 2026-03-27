package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_AddPathology;
import com.hms.services.adminmanagement.entity.HMS_TW_AddPathology;
import com.hms.services.adminmanagement.service.AddPathologyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/Add-pathologies")
public class AddPathologyController {

    @Autowired
    private AddPathologyService pathologyService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_AddPathology> createPathology(@Valid @RequestBody HMS_TW_AddPathology pathology) {
        return ResponseEntity.ok(pathologyService.createPathology(pathology));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_AddPathology> getPathologyById(@PathVariable String id) {
        HMS_TW_AddPathology pathology = pathologyService.getPathologyById(id);
        if (pathology != null) {
            return ResponseEntity.ok(pathology);
        } else {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_AddPathology>> getAllPathologiesTW() {
        List<HMS_TW_AddPathology> pathologies = pathologyService.getAllPathologiesTW();
        return ResponseEntity.ok(pathologies);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_AddPathology> updatePathology(
            @PathVariable String id, @Valid @RequestBody HMS_TW_AddPathology pathology) {
        return ResponseEntity.ok(pathologyService.updatePathology(id, pathology));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TW_AddPathology> approvePathology(
            @PathVariable String id) {

        HMS_TW_AddPathology approvedPathology = pathologyService.approvePathology(id);
        return ResponseEntity.ok(approvedPathology);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePathology(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            pathologyService.deletePathology(id, authStat);
            return ResponseEntity.ok("Pathology deleted from TM and status updated to UNAUTHORIZED in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Pathology not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_AddPathology> getTMPathologyById(@PathVariable String id) {
        return ResponseEntity.ok(pathologyService.getTMPathologyById(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_AddPathology>> getAllPathologiesTM() {
        List<HMS_TM_AddPathology> pathologies = pathologyService.getAllPathologiesTM();
        return ResponseEntity.ok(pathologies);
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_AddPathology> updateTMPathology(
            @PathVariable String id, @Valid @RequestBody HMS_TM_AddPathology pathology) {
        return ResponseEntity.ok(pathologyService.updateTMPathology(id, pathology));
    }

    @DeleteMapping("/tw/remove/{id}")
    public ResponseEntity<String> deleteTWPathology(@PathVariable String id) {
        try {
            pathologyService.deleteTWPathology(id);
            return new ResponseEntity<>("Pathology marked as deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Pathology not found or cannot be deleted.", HttpStatus.NOT_FOUND);
        }
    }
}



