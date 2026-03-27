package com.hms.services.opdmanagement.controller;



import com.hms.services.opdmanagement.entity.HMS_TM_OPDTimeLine;
import com.hms.services.opdmanagement.service.TimeLineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/opd_timelines")
public class OPDTimeLineController {



    private final TimeLineService timeLineService;

    @Autowired
    public OPDTimeLineController(final TimeLineService timeLineService) {
        this.timeLineService = timeLineService;
    }

    // Add a new timeline
    @PostMapping("/add")
    public ResponseEntity<HMS_TM_OPDTimeLine> addTimeLine(
            @RequestPart("timeLine") HMS_TM_OPDTimeLine timeLine,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) throws IOException {

        HMS_TM_OPDTimeLine savedTimeLine = timeLineService.addTimeLine(timeLine, attachment);
        return ResponseEntity.ok(savedTimeLine);
    }


    // Update an existing timeline
    @PutMapping("/{timeLineId}")
    public ResponseEntity<HMS_TM_OPDTimeLine> updateTimeLine(
            @PathVariable String timeLineId,
            @RequestPart("timeLine") HMS_TM_OPDTimeLine updatedTimeLine,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) throws IOException {

        HMS_TM_OPDTimeLine timeLine = timeLineService.updateTimeLine(timeLineId, updatedTimeLine, attachment);
        return ResponseEntity.ok(timeLine);
    }

    // Delete a timeline by ID
    @DeleteMapping("/{timeLineId}")
    public ResponseEntity<Void> deleteTimeLine(@PathVariable String timeLineId) {
        timeLineService.deleteTimeLine(timeLineId);
        return ResponseEntity.noContent().build();
    }

    // Get a timeline by ID
    @GetMapping("/{timeLineId}")
    public ResponseEntity<HMS_TM_OPDTimeLine> getTimeLineById(@PathVariable String timeLineId) {
        HMS_TM_OPDTimeLine timeLine = timeLineService.getTimeLineById(timeLineId);
        return ResponseEntity.ok(timeLine);
    }

    // Get all timelines
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_OPDTimeLine>> getAllTimeLines() {
        List<HMS_TM_OPDTimeLine> timeLines = timeLineService.getAllTimeLines();
        return ResponseEntity.ok(timeLines);
    }
    @GetMapping("/by-opd/{opdId}")
    public ResponseEntity<List<HMS_TM_OPDTimeLine>> getTimeLinesByIpdId(@PathVariable String ipdId) {
        List<HMS_TM_OPDTimeLine> timeLines = timeLineService.getTimeLinesByIpdId(ipdId);
        if (timeLines.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(timeLines);
        }
    }



}

