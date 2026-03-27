package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_RadiologyParameter;
import com.hms.services.adminmanagement.entity.HMS_TW_RadiologyParameter;
import com.hms.services.adminmanagement.service.RadiologyParameterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/radiology-parameter")
public class RadiologyParameterController {

    @Autowired
    private RadiologyParameterService radiologyParameterService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_RadiologyParameter> createRadiologyParameter(@Valid @RequestBody HMS_TW_RadiologyParameter parameter) {
        HMS_TW_RadiologyParameter createdParameter = radiologyParameterService.createRadiologyParameter(parameter);
        return new ResponseEntity<>(createdParameter, HttpStatus.CREATED);
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_RadiologyParameter> getRadiologyParameterById(@PathVariable String id) {
        try {
            HMS_TW_RadiologyParameter parameter = radiologyParameterService.getRadiologyParameterById(id);
            return new ResponseEntity<>(parameter, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_RadiologyParameter>> getAllRadiologyParametersTW() {
        List<HMS_TW_RadiologyParameter> parameters = radiologyParameterService.getAllRadiologyParametersTW();
        return new ResponseEntity<>(parameters, HttpStatus.OK);
    }

    @PutMapping("/tw/update/{id}")
    public ResponseEntity<HMS_TW_RadiologyParameter> updateRadiologyParameter(
            @PathVariable String id, @Valid @RequestBody HMS_TW_RadiologyParameter updatedParameter) {
        HMS_TW_RadiologyParameter updatedParam = radiologyParameterService.updateRadiologyParameter(id, updatedParameter);
        return new ResponseEntity<>(updatedParam, HttpStatus.OK);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_RadiologyParameter> approveRadiologyParameter(
            @PathVariable String id) {
        HMS_TM_RadiologyParameter approvedParameter = radiologyParameterService.approveRadiologyParameter(id);
        return new ResponseEntity<>(approvedParameter, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRadiologyParameter(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            radiologyParameterService.deleteRadiologyParameter(id, authStat);
            return ResponseEntity.ok("Radiology parameter deleted from TM and status updated in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Radiology parameter not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_RadiologyParameter> getRadiologyParameterByIdTM(@PathVariable String id) {
        HMS_TM_RadiologyParameter parameter = radiologyParameterService.getRadiologyParameterByIdTM(id);
        return new ResponseEntity<>(parameter, HttpStatus.OK);
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_RadiologyParameter>> getAllRadiologyParametersTM() {
        List<HMS_TM_RadiologyParameter> parameters = radiologyParameterService.getAllRadiologyParametersTM();
        return new ResponseEntity<>(parameters, HttpStatus.OK);
    }

    @PutMapping("/tm/update/{id}")
    public ResponseEntity<HMS_TM_RadiologyParameter> updateRadiologyParameterTM(
            @PathVariable String id, @Valid @RequestBody HMS_TM_RadiologyParameter updatedParameter) {
        HMS_TM_RadiologyParameter updatedParam = radiologyParameterService.updateRadiologyParameterTM(id, updatedParameter);
        return new ResponseEntity<>(updatedParam, HttpStatus.OK);
    }

    @DeleteMapping("/tw/delete/{id}")
    public ResponseEntity<Void> deleteTwParameter(@PathVariable String id) {
        radiologyParameterService.deleteTwParameter(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}



