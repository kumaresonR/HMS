package com.hms.services.laboratorymanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.laboratorymanagement.entity.HMS_TM_LabReports;
import com.hms.services.laboratorymanagement.model.LabReportRequest;
import com.hms.services.laboratorymanagement.service.LabReportsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/lab-reports")
public class LabReportsController {

    @Autowired
    private LabReportsService labReportsService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TM_LabReports> uploadLabReport(
            @RequestPart("reportData") String reportDataJson,
            @RequestPart("reportFile") MultipartFile reportFile) {
        ObjectMapper mapper = new ObjectMapper();
        LabReportRequest reportData;
        try {
            reportData = mapper.readValue(reportDataJson, LabReportRequest.class);
            HMS_TM_LabReports savedReport = labReportsService.uploadLabReport(reportData, reportFile);
            return ResponseEntity.ok(savedReport);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload lab report", e);
        }
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<HMS_TM_LabReports> getLabReport(@PathVariable String reportId) {
        HMS_TM_LabReports labReport = labReportsService.getLabReport(reportId)
                .orElseThrow(() -> new RuntimeException("Lab report not found"));
        return ResponseEntity.ok(labReport);
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_LabReports>> getAllLabReports() {
        List<HMS_TM_LabReports> labReports = labReportsService.getAllLabReports();
        return ResponseEntity.ok(labReports);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<HMS_TM_LabReports> updateLabReport(
            @PathVariable String id,
            @RequestPart("reportData") String reportDataJson,
            @RequestPart(value = "reportFile", required = false) MultipartFile reportFile) {
        ObjectMapper mapper = new ObjectMapper();
        LabReportRequest reportData;
        try {
            reportData = mapper.readValue(reportDataJson, LabReportRequest.class);
            HMS_TM_LabReports updatedReport = labReportsService.updateLabReport(id, reportData, reportFile);
            return ResponseEntity.ok(updatedReport);
        } catch (IOException e) {
            throw new RuntimeException("Failed to update lab report", e);
        }
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteLabReport(@PathVariable String reportId) {
        labReportsService.deleteLabReport(reportId);
        return ResponseEntity.noContent().build();
    }
}

