package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_PathologyParameter;
import com.hms.services.adminmanagement.entity.HMS_TW_PathologyParameter;
import com.hms.services.adminmanagement.service.PathologyParameterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/pathology-parameter")
public class PathologyParameterController {

    @Autowired
    private PathologyParameterService pathologyParameterService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_PathologyParameter> createPathologyParameter(@Valid @RequestBody HMS_TW_PathologyParameter parameter) {
        HMS_TW_PathologyParameter createdParameter = pathologyParameterService.createPathologyParameter(parameter);
        return new ResponseEntity<>(createdParameter, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TW_PathologyParameter> getPathologyParameterById(@PathVariable String id) {
        try {
            HMS_TW_PathologyParameter parameter = pathologyParameterService.getPathologyParameterById(id);
            return new ResponseEntity<>(parameter, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_PathologyParameter>> getAllPathologyParametersTW() {
        List<HMS_TW_PathologyParameter> parameters = pathologyParameterService.getAllPathologyParametersTW();
        return new ResponseEntity<>(parameters, HttpStatus.OK);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<HMS_TW_PathologyParameter> updatePathologyParameter(
            @PathVariable String id, @Valid @RequestBody HMS_TW_PathologyParameter updatedParameter) {
        HMS_TW_PathologyParameter updatedParam = pathologyParameterService.updatePathologyParameter(id, updatedParameter);
        return new ResponseEntity<>(updatedParam, HttpStatus.OK);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_PathologyParameter> approvePathologyParameter(
            @PathVariable String id) {
        HMS_TM_PathologyParameter approvedParameter = pathologyParameterService.approvePathologyParameter(id);
        return new ResponseEntity<>(approvedParameter, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePathologyParameter(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            pathologyParameterService.deletePathologyParameter(id, authStat);
            return ResponseEntity.ok("Pathology Parameter deleted from TM and status updated in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Pathology parameter not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_PathologyParameter> getPathologyParameterByIdTM(@PathVariable String id) {
        HMS_TM_PathologyParameter parameter = pathologyParameterService.getPathologyParameterByIdTM(id);
        return new ResponseEntity<>(parameter, HttpStatus.OK);
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_PathologyParameter>> getAllPathologyParametersTM() {
        List<HMS_TM_PathologyParameter> parameters = pathologyParameterService.getAllPathologyParametersTM();
        return new ResponseEntity<>(parameters, HttpStatus.OK);
    }

    @PutMapping("/tm/{id}/update")
    public ResponseEntity<HMS_TM_PathologyParameter> updatePathologyParameterTM(
            @PathVariable String id, @Valid @RequestBody HMS_TM_PathologyParameter updatedParameter) {
        HMS_TM_PathologyParameter updatedParam = pathologyParameterService.updatePathologyParameterTM(id, updatedParameter);
        return new ResponseEntity<>(updatedParam, HttpStatus.OK);
    }

    @DeleteMapping("/tw/{id}/delete")
    public ResponseEntity<Void> deleteTwParameter(@PathVariable String id) {
        pathologyParameterService.deleteTwParameter(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}




