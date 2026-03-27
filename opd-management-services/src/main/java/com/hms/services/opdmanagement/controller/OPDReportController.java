package com.hms.services.opdmanagement.controller;

import com.hms.services.opdmanagement.model.OPDChargesReportDTO;
import com.hms.services.opdmanagement.model.PaginatedResponse;
import com.hms.services.opdmanagement.model.PaymentResponse;
import com.hms.services.opdmanagement.response.OPDReportResponseDTO;
import com.hms.services.opdmanagement.service.OPDReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/opdReports")
public class OPDReportController {

    @Autowired
    private OPDReportService opdReportService;

    @GetMapping
    public ResponseEntity<List<OPDReportResponseDTO>> getOPDReports(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String symptoms,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<OPDReportResponseDTO> response = opdReportService.getOPDReports(
                timeDuration, doctorId, symptoms, startDate, endDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/reports/download")
    public ResponseEntity<Resource> downloadOPDReportsAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String symptoms,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) throws IOException {
        List<OPDReportResponseDTO> reports = opdReportService.getOPDReports(
                timeDuration, doctorId, symptoms, startDate, endDate);

        ByteArrayInputStream in = opdReportService.generateOPDReportsExcel(reports);

        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=opd_reports.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }


    @GetMapping("/charges")
    public ResponseEntity<PaginatedResponse<OPDChargesReportDTO>> getOPDChargesReports(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String symptoms,
            @RequestParam(required = false) boolean isGstAdded,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PaginatedResponse<OPDChargesReportDTO> response = opdReportService.getOPDChargesReports(
                timeDuration, doctorId, symptoms, isGstAdded, startDate, endDate, page, size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/charges/download")
    public ResponseEntity<Resource> downloadOPDChargesReportAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String symptoms,
            @RequestParam(required = false) boolean isGstAdded,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) throws IOException {
        PaginatedResponse<OPDChargesReportDTO> response = opdReportService.getOPDChargesReports(
                timeDuration, doctorId, symptoms, isGstAdded, startDate, endDate, page, size);

        ByteArrayInputStream in = opdReportService.generateChargesExcel(response.getContent());

        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=opd_charges_report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }


    @GetMapping("/payments")
    public ResponseEntity<PaginatedResponse<PaymentResponse>> getOPDPaymentsReports(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PaginatedResponse<PaymentResponse> response = opdReportService.getOPDPaymentsReports(
                timeDuration, paymentMode, startDate, endDate, page, size);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/payments/download")
    public ResponseEntity<Resource> downloadOPDPaymentsReportAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PaginatedResponse<PaymentResponse> response = opdReportService.getOPDPaymentsReports(
                timeDuration, paymentMode, startDate, endDate, page, size
        );

        try {
            ByteArrayInputStream excelStream = opdReportService.generatePaymentsExcel(response.getContent());
            InputStreamResource resource = new InputStreamResource(excelStream);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=OPD_Payments_Report.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(resource);
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate Excel report", e);
        }
    }





}

