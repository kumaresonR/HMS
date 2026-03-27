package com.hms.services.ambulancemanagement.controller;


import com.hms.services.ambulancemanagement.model.AmbulancePaymentResponse;
import com.hms.services.ambulancemanagement.model.PaginatedResponse;
import com.hms.services.ambulancemanagement.service.AmbulanceReportService;
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
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private AmbulanceReportService ambulanceReportService;

    @GetMapping("/ambulance/payments")
    public ResponseEntity<PaginatedResponse<AmbulancePaymentResponse>> getAmbulancePaymentsReports(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) boolean isGstAdded,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PaginatedResponse<AmbulancePaymentResponse> response = ambulanceReportService.getAmbulancePaymentsReports(
                timeDuration, paymentMode, isGstAdded,startDate, endDate, page, size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/payments/download")
    public ResponseEntity<Resource> downloadAmbulancePaymentsAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) boolean isGstAdded,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) throws IOException {
        PaginatedResponse<AmbulancePaymentResponse> response = ambulanceReportService.getAmbulancePaymentsReports(
                timeDuration, paymentMode, isGstAdded, startDate, endDate, 0, Integer.MAX_VALUE
        );
        List<AmbulancePaymentResponse> payments = response.getContent();
        ByteArrayInputStream in = ambulanceReportService.generateAmbulancePaymentsExcel(payments);
        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ambulance_payments_report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }


}


