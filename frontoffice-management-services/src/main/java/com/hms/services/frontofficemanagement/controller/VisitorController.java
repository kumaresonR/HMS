package com.hms.services.frontofficemanagement.controller;

import com.hms.services.frontofficemanagement.model.Visitor;
import com.hms.services.frontofficemanagement.service.VisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/front-office")
public class VisitorController {

    @Autowired
    private final VisitorService visitorService;

    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }


    @PostMapping("/visitor/add")
    public ResponseEntity<Visitor> createVisitor(@RequestBody Visitor visitorDto) {
        Visitor visitor = visitorService.createVisitor(visitorDto);
        return new ResponseEntity<>(visitor, HttpStatus.CREATED);
    }

    @GetMapping("/visitors")
    public ResponseEntity<List<Visitor>> getAllVisitors() {
        List<Visitor> visitors = null;
        visitors = visitorService.getAllVisitors();
        if (visitors != null && !visitors.isEmpty()) {
            return new ResponseEntity<>(visitors, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/visitor/{id}")
    public ResponseEntity<Visitor> getVisitorById(@PathVariable UUID id) {
        Visitor visitor = null;
        visitor = visitorService.getVisitorById(id);
        if (visitor != null) {
            return new ResponseEntity<>(visitor, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PutMapping("/visitor/{id}")
    ResponseEntity<Visitor> updateVisitor(@PathVariable UUID id, @RequestBody Visitor visitorDto) {
        Visitor updatedVisitor = visitorService.updateVisitor(id, visitorDto);
        if(updatedVisitor!=null) {
            return new ResponseEntity<>(updatedVisitor, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @DeleteMapping("/visitor/{id}")
    public ResponseEntity<String> deleteVisitor(@PathVariable UUID id) {
        Boolean isDeleted = visitorService.deleteVisitorById(id);
        if (isDeleted) {
            return ResponseEntity.ok("visitor with ID " + id + " deleted successfully.");
        }else{
            return ResponseEntity.notFound().build();
        }

    }
}


