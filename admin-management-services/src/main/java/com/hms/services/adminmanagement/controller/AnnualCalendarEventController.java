package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_AnnualCalendarEvent;
import com.hms.services.adminmanagement.service.AnnualCalendarEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/annual-calender")
public class AnnualCalendarEventController {

    @Autowired
    private AnnualCalendarEventService service;

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_AnnualCalendarEvent>> getAllAnnualEvents() {
        List<HMS_TM_AnnualCalendarEvent> events = service.getAllAnnualEvents();
        return events.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_AnnualCalendarEvent> getAnnualEventById(@PathVariable String id) {
        return service.getAnnualEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<HMS_TM_AnnualCalendarEvent>> getEventsByType(@PathVariable String type) {
        List<HMS_TM_AnnualCalendarEvent> events = service.getEventsByType(type);
        return events.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(events);
    }

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_AnnualCalendarEvent> createEvent(@RequestBody HMS_TM_AnnualCalendarEvent event) {
        return ResponseEntity.ok(service.createEvent(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_AnnualCalendarEvent> updateEvent(@PathVariable String id, @RequestBody HMS_TM_AnnualCalendarEvent event) {
        try {
            return ResponseEntity.ok(service.updateEvent(id, event));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAnnualCalendarEvent(@PathVariable String id) {
        service.deleteAnnualCalendarEvent(id);
        return new ResponseEntity<>("Annual Calender marked as deleted.", HttpStatus.OK);
    }
}




