package com.hms.services.laboratorymanagement.service;

import com.hms.services.laboratorymanagement.entity.HMS_TM_LabReports;
import com.hms.services.laboratorymanagement.model.LabReportRequest;
import com.hms.services.laboratorymanagement.repository.LabReportsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LabReportsService {

    @Autowired
    private LabReportsRepository labReportsRepository;


    public HMS_TM_LabReports uploadLabReport(LabReportRequest reportData, MultipartFile reportFile) {
        HMS_TM_LabReports labReport = new HMS_TM_LabReports();
        labReport.setPatientId(reportData.getPatientId());
        labReport.setReportDate(LocalDateTime.parse(reportData.getReportDate()));
        labReport.setTestResultId(reportData.getTestResultId());

        try {
            if (reportFile != null && !reportFile.isEmpty()) {
                labReport.setReportFile(reportFile.getBytes());
            } else {
                throw new RuntimeException("File is empty or not provided");
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert file to byte array", e);
        }

        return labReportsRepository.save(labReport);
    }

    public Optional<HMS_TM_LabReports> getLabReport(String reportId) {
        return labReportsRepository.findById(reportId);
    }

    public List<HMS_TM_LabReports> getAllLabReports() {
        return labReportsRepository.findAll();
    }

    public HMS_TM_LabReports updateLabReport(String id, LabReportRequest reportData, MultipartFile reportFile) {
        HMS_TM_LabReports existingReport = labReportsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab report not found with id: " + id));

        existingReport.setPatientId(reportData.getPatientId());
        existingReport.setReportDate(LocalDateTime.parse(reportData.getReportDate()));
        existingReport.setTestResultId(reportData.getTestResultId());

        if (reportFile != null && !reportFile.isEmpty()) {
            try {
                byte[] fileBytes = reportFile.getBytes();
                existingReport.setReportFile(fileBytes);
            } catch (IOException e) {
                throw new RuntimeException("Failed to convert file to byte array", e);
            }
        }

        HMS_TM_LabReports savedReport = labReportsRepository.save(existingReport);
        System.out.println("Saved report file size (bytes): " + savedReport.getReportFile().length);

        return savedReport;
    }


    public void deleteLabReport(String reportId) {
        labReportsRepository.deleteById(reportId);
    }
}

