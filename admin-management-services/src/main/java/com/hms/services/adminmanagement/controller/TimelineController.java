package com.hms.services.adminmanagement.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.adminmanagement.entity.HMS_TM_Timeline;
import com.hms.services.adminmanagement.service.TimelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/timeline")
public class TimelineController {

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/create")
    public ResponseEntity<?> createTimeline(
            @RequestPart("timelineData") String timelineDataJson,
            @RequestPart(value = "document", required = false) MultipartFile documentFile) {

        try {
            HMS_TM_Timeline timeline = objectMapper.readValue(timelineDataJson, HMS_TM_Timeline.class);
            HMS_TM_Timeline savedTimeline = timelineService.saveTimelineWithDocument(timeline, documentFile);
            return new ResponseEntity<>(savedTimeline, HttpStatus.CREATED);

        } catch (JsonProcessingException e) {
            return new ResponseEntity<>("Error processing request: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            throw new RuntimeException("Error saving timeline", e);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_Timeline>> getAllTimelines() {
        List<HMS_TM_Timeline> timelines = timelineService.getAllTimelines();
        return new ResponseEntity<>(timelines, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_Timeline> getTimelineById(@PathVariable String id) {
        Optional<HMS_TM_Timeline> timeline = timelineService.getTimelineById(id);
        return timeline.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_Timeline> updateTimeline(
            @PathVariable String id,
            @RequestPart("timelineData") String timelineDataJson,
            @RequestPart(value = "document", required = false) MultipartFile documentFile) {

        try {
            HMS_TM_Timeline timeline = objectMapper.readValue(timelineDataJson, HMS_TM_Timeline.class);
            timeline.setTimelineId(id);
            HMS_TM_Timeline updatedTimeline = timelineService.updateTimeline(id, timeline, documentFile);
            return updatedTimeline != null ? ResponseEntity.ok(updatedTimeline) : ResponseEntity.notFound().build();

        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTimeline(@PathVariable String id) {
        try {
            boolean isDeleted = timelineService.softDeleteTimeline(id);

            if (isDeleted) {
                return ResponseEntity.ok("Timeline deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Timeline with ID " + id + " not found.");
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing request: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}



