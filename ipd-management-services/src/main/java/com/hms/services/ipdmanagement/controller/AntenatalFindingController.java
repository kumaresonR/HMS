package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.entity.HMS_TM_AntenatalFinding;
import com.hms.services.ipdmanagement.service.AntenatalFindingService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/antenatal-finding")
public class AntenatalFindingController {


    private final AntenatalFindingService antenatalFindingService;


    @Autowired
    public AntenatalFindingController(AntenatalFindingService antenatalFindingService) {
        this.antenatalFindingService = antenatalFindingService;
    }

    @PostMapping("/add")
    public ResponseEntity<HMS_TM_AntenatalFinding> create(@RequestBody HMS_TM_AntenatalFinding antenatalFinding) {
        return ResponseEntity.status(HttpStatus.CREATED).body(antenatalFindingService.createAntenatalFinding(antenatalFinding));
    }

    @GetMapping("/ipd/{ipdId}")
    public ResponseEntity<List<HMS_TM_AntenatalFinding>> getByIpdId(@PathVariable String ipdId) {
        return ResponseEntity.ok(antenatalFindingService.getByIpdId(ipdId));
    }

    @PutMapping("/{antenatalId}")
    public ResponseEntity<HMS_TM_AntenatalFinding> update(
            @PathVariable String antenatalId,
            @RequestBody HMS_TM_AntenatalFinding updatedData) {
        return ResponseEntity.ok(antenatalFindingService.updateAntenatalFinding(antenatalId, updatedData));
    }

    @DeleteMapping("/delete/{antenatalId}")
    public ResponseEntity<JSONObject> softDelete(@PathVariable String antenatalId) {
        String json = antenatalFindingService.softDeleteAntenatalFinding(antenatalId);
        JSONObject response = new JSONObject();
        response.put("message", json);
        return ResponseEntity.ok(response);
    }




}

