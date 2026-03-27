package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.entity.HMS_TM_TimeLine;
import com.hms.services.ipdmanagement.service.BedGroupService;
import com.hms.services.ipdmanagement.service.TimeLineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/ipd_timelines")
public class IPDTimeLineController {



    private final TimeLineService timeLineService;

    @Autowired
    public IPDTimeLineController(final TimeLineService timeLineService) {
        this.timeLineService = timeLineService;
    }

    // Add a new timeline
    @PostMapping("/add")
    public ResponseEntity<HMS_TM_TimeLine> addTimeLine(
            @RequestPart("timeLine") HMS_TM_TimeLine timeLine,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) throws IOException {

        HMS_TM_TimeLine savedTimeLine = timeLineService.addTimeLine(timeLine, attachment);
        return ResponseEntity.ok(savedTimeLine);
    }


    // Update an existing timeline
    @PutMapping("/{timeLineId}")
    public ResponseEntity<HMS_TM_TimeLine> updateTimeLine(
            @PathVariable String timeLineId,
            @RequestPart("timeLine") HMS_TM_TimeLine updatedTimeLine,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) throws IOException {

        HMS_TM_TimeLine timeLine = timeLineService.updateTimeLine(timeLineId, updatedTimeLine, attachment);
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
    public ResponseEntity<HMS_TM_TimeLine> getTimeLineById(@PathVariable String timeLineId) {
        HMS_TM_TimeLine timeLine = timeLineService.getTimeLineById(timeLineId);
        return ResponseEntity.ok(timeLine);
    }

    // Get all timelines
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_TimeLine>> getAllTimeLines() {
        List<HMS_TM_TimeLine> timeLines = timeLineService.getAllTimeLines();
        return ResponseEntity.ok(timeLines);
    }
    @GetMapping("/by-ipd/{ipdId}")
    public ResponseEntity<List<HMS_TM_TimeLine>> getTimeLinesByIpdId(@PathVariable String ipdId) {
        List<HMS_TM_TimeLine> timeLines = timeLineService.getTimeLinesByIpdId(ipdId);
        if (timeLines.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(timeLines);
        }
    }



}

