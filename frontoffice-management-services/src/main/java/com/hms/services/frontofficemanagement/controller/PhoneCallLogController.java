package com.hms.services.frontofficemanagement.controller;

import com.hms.services.frontofficemanagement.model.PhoneCallLog;
import com.hms.services.frontofficemanagement.service.PhoneCallLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/front-office")
public class PhoneCallLogController {

    @Autowired
    private final PhoneCallLogService phoneCallLogService;

    public PhoneCallLogController(PhoneCallLogService phoneCallLogService) {
        this.phoneCallLogService = phoneCallLogService;
    }


    @PostMapping("/phonecalllog/add")
    public ResponseEntity<PhoneCallLog> createEmployee(@RequestBody PhoneCallLog phoneCallLogDto) {
        PhoneCallLog phoneCallLog= phoneCallLogService.createPhoneCallLog(phoneCallLogDto);
        return new ResponseEntity<>(phoneCallLog, HttpStatus.CREATED);
    }

    @GetMapping("/phonecalllogs")
    public ResponseEntity<List<PhoneCallLog>> getAllPhoneCallLogs() {
        List<PhoneCallLog> phoneCallLogs = null;
        phoneCallLogs = phoneCallLogService.getAllPhoneCallLogs();
        if (phoneCallLogs != null && !phoneCallLogs.isEmpty()) {
            return new ResponseEntity<>(phoneCallLogs, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/phonecalllog/{id}")
    public ResponseEntity<PhoneCallLog> getPhoneCallLogById(@PathVariable UUID id) {
        PhoneCallLog phoneCallLog = null;
        phoneCallLog = phoneCallLogService.getPhoneCallLogById(id);
        if (phoneCallLog != null) {
            return new ResponseEntity<>(phoneCallLog, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PutMapping("/phonecalllog/{id}")
    ResponseEntity<PhoneCallLog> updatePhoneCallLog(@PathVariable UUID id, @RequestBody PhoneCallLog phoneCallLogDto) {
        PhoneCallLog updatedPhoneCallLog = phoneCallLogService.updatePhoneCallLog(id, phoneCallLogDto);
        if(updatedPhoneCallLog!=null) {
            return new ResponseEntity<>(updatedPhoneCallLog, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @DeleteMapping("/phonecalllog/{id}")
    public ResponseEntity<String> deletePhoneCallLog(@PathVariable UUID id) {
        Boolean isDeleted = phoneCallLogService.deletePhoneCallLogById(id);
        if (isDeleted) {
            return ResponseEntity.ok("Complaint with ID " + id + " deleted successfully.");
        }else{
            return ResponseEntity.notFound().build();
        }

    }
}


