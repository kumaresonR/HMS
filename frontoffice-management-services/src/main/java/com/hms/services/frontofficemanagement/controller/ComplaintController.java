package com.hms.services.frontofficemanagement.controller;

import com.hms.services.frontofficemanagement.model.Complaint;
import com.hms.services.frontofficemanagement.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/front-office")
public class ComplaintController {

    @Autowired
    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }


    @PostMapping("/complaint/add")
    public ResponseEntity<Complaint> createComplaint(@RequestBody Complaint complaintDto) {
        Complaint complaint = complaintService.createComplaint(complaintDto);
        return new ResponseEntity<>(complaint, HttpStatus.CREATED);
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        List<Complaint> complaints = null;
        complaints = complaintService.getAllComplaints();
        if (complaints != null && !complaints.isEmpty()) {
            return new ResponseEntity<>(complaints, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/complaint/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable UUID id) {
        Complaint complaint = null;
        complaint = complaintService.getComplaintById(id);
        if (complaint != null) {
            return new ResponseEntity<>(complaint, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PutMapping("/complaint/{id}")
    ResponseEntity<Complaint> updateComplaint(@PathVariable UUID id, @RequestBody Complaint complaintDto) {
        Complaint updatedComplaint = complaintService.updateComplaint(id, complaintDto);
        if(updatedComplaint!=null) {
            return new ResponseEntity<>(updatedComplaint, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @DeleteMapping("/complaint/{id}")
    public ResponseEntity<String> deleteComplaint(@PathVariable UUID id) {
        Boolean isDeleted = complaintService.deleteComplaintById(id);
        if (isDeleted) {
            return ResponseEntity.ok("Complaint with ID " + id + " deleted successfully.");
        }else{
            return ResponseEntity.notFound().build();
        }

    }
}


