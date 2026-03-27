package com.hms.services.ipdmanagement.controller;

import com.hms.services.ipdmanagement.model.IPDChargesReportDTO;
import com.hms.services.ipdmanagement.model.PaginatedResponse;
import com.hms.services.ipdmanagement.model.PaymentResponse;
import com.hms.services.ipdmanagement.response.IPDReportResponseDTO;
import com.hms.services.ipdmanagement.service.IPDReportService;
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
@RequestMapping("/ipd-reports")
public class IPDReportController {

    @Autowired
    private IPDReportService ipdReportService;

    @GetMapping
    public ResponseEntity<List<IPDReportResponseDTO>> getIPDReports(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String symptoms,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<IPDReportResponseDTO> response = ipdReportService.getIPDReports(
                timeDuration, doctorId, symptoms, startDate, endDate);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadIPDReportsAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String symptoms,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) throws IOException {

        List<IPDReportResponseDTO> ipdReports = ipdReportService.getIPDReports(timeDuration, doctorId, symptoms, startDate, endDate);
        ByteArrayInputStream in = ipdReportService.generateIPDReportExcel(ipdReports);
        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ipd_reports.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }


    @GetMapping("/charges")
    public ResponseEntity<PaginatedResponse<IPDChargesReportDTO>> getOPDChargesReports(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String symptoms,
            @RequestParam(required = false) boolean isGstAdded,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PaginatedResponse<IPDChargesReportDTO> response = ipdReportService.getIPDChargesReports(
                timeDuration, doctorId, symptoms, isGstAdded, startDate, endDate, page, size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/charges/download")
    public ResponseEntity<Resource> downloadIPDChargesAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String symptoms,
            @RequestParam(required = false) boolean isGstAdded,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) throws IOException {
        PaginatedResponse<IPDChargesReportDTO> paginatedResponse = ipdReportService.getIPDChargesReports(
                timeDuration, doctorId, symptoms, isGstAdded, startDate, endDate, page, size);

        List<IPDChargesReportDTO> charges = paginatedResponse.getContent();
        ByteArrayInputStream in = ipdReportService.generateIPDChargesExcel(charges);

        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ipd_charges_report.xlsx")
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

        PaginatedResponse<PaymentResponse> response = ipdReportService.getIPDPaymentsReports(
                timeDuration, paymentMode,startDate, endDate,page, size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/payments/download")
    public ResponseEntity<Resource> downloadOPDPaymentsAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) throws IOException {
        PaginatedResponse<PaymentResponse> paginatedResponse = ipdReportService.getIPDPaymentsReports(
                timeDuration, paymentMode, startDate, endDate, page, size);

        List<PaymentResponse> payments = paginatedResponse.getContent();
        ByteArrayInputStream in = ipdReportService.generateOPDPaymentsExcel(payments);

        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=opd_payments_report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }




}






















//    @GetMapping("/balance")
//    public ResponseEntity<List<IPDBalanceResponseDTO>> getIPDBalanceReport(
//            @RequestParam(required = false) String timeDuration,
//            @RequestParam(required = false) String patientStatus,
//
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
//
//        List<IPDBalanceResponseDTO> report = ipdReportService.getIPDBalanceReport(
//                timeDuration, patientStatus, startDate, endDate);
//
//        return ResponseEntity.ok(report);
//    }
//

//    @GetMapping("/search")
//    public ResponseEntity<List<PatientReportResponse>> searchAdmissions(
//            @RequestParam(required = false) String doctorName,
//            @RequestParam(required = false) String timeDuration,
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
//
//        List<PatientReportResponse> response = ipdReportService.searchAdmissions(
//                doctorName,
//                timeDuration,
//                startDate,
//                endDate
//        );
//        return ResponseEntity.ok(response);
//    }




