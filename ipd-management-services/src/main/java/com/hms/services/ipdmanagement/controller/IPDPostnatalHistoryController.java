package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.entity.HMS_TM_PostnatalHistory;
import com.hms.services.ipdmanagement.service.NurseNotesService;
import com.hms.services.ipdmanagement.service.PostnatalHistoryService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/ipd_postnatal_history")
public class IPDPostnatalHistoryController {


    private final PostnatalHistoryService postnatalHistoryService;

    @Autowired
    public IPDPostnatalHistoryController(final PostnatalHistoryService postnatalHistoryService) {
        this.postnatalHistoryService = postnatalHistoryService;
    }


    @PostMapping("/add")
    public ResponseEntity<HMS_TM_PostnatalHistory> create(
            @Valid @RequestBody HMS_TM_PostnatalHistory postnatalHistory) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postnatalHistoryService.createPostnatalHistory(postnatalHistory));
    }

    @GetMapping("/ipd/{ipdId}")
    public ResponseEntity<List<HMS_TM_PostnatalHistory>> getByIpdId(@PathVariable String ipdId) {
        return ResponseEntity.ok(postnatalHistoryService.getByIpdId(ipdId));
    }

    @PutMapping("/{postnatalId}")
    public ResponseEntity<HMS_TM_PostnatalHistory> update(
            @PathVariable String postnatalId,
            @Valid @RequestBody HMS_TM_PostnatalHistory updatedData) {
        return ResponseEntity.ok(postnatalHistoryService.updatePostnatalHistory(postnatalId,updatedData));
    }

    @DeleteMapping("/delete/{postnatalId}")
    public ResponseEntity<JSONObject> softDelete(@PathVariable String postnatalId) {
        String json=postnatalHistoryService.softDeletePostnatalHistory(postnatalId);
        JSONObject obj=new JSONObject();
        obj.put("message",json);
        return ResponseEntity.ok(obj);
    }



}

