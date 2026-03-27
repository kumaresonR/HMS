package com.hms.services.bloodbankmanagement.controller;

import com.hms.services.bloodbankmanagement.model.*;
import com.hms.services.bloodbankmanagement.service.IssueBloodService;
import com.hms.services.bloodbankmanagement.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
    private ReportService reportService;


    @GetMapping("/blood/issue")
    public ResponseEntity<PaginatedResponse<BloodIssuePaymentResponse>> getIssueBloodReports(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String technician,
            @RequestParam(required = false) Boolean isGstAdded,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PaginatedResponse<BloodIssuePaymentResponse> response = reportService.getBloodIssuePaymentsReports(
                timeDuration,paymentMode, bloodGroup,technician,isGstAdded, startDate, endDate, page, size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/blood/issue/download")
    public ResponseEntity<Resource> downloadBloodIssuePaymentsAsExcel(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String technician,
            @RequestParam(required = false) Boolean isGstAdded,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) throws IOException {

        PaginatedResponse<BloodIssuePaymentResponse> response = reportService.getBloodIssuePaymentsReports(
                timeDuration, paymentMode,bloodGroup,technician,isGstAdded, startDate, endDate, 0, Integer.MAX_VALUE
        );

        List<BloodIssuePaymentResponse> payments = response.getContent();
        ByteArrayInputStream in = reportService.generateBloodIssuePaymentsExcel(payments);
        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=blood_issue_payments_report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }


    @GetMapping("/blood/component")
    public ResponseEntity<PaginatedResponse<IssueComponentDTO>> getBloodComponentReports(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String technician,
            @RequestParam(required = false) String components,
            @RequestParam(required = false) Boolean isGstAdded,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PaginatedResponse<IssueComponentDTO> response = reportService.getBloodComponentPaymentsReports(
                timeDuration, paymentMode,bloodGroup,technician,components,isGstAdded, startDate, endDate, page, size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/blood/component/download")
    public ResponseEntity<?> getBloodComponentReports(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String technician,
            @RequestParam(required = false) String components,
            @RequestParam(required = false) Boolean isGstAdded,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) boolean exportExcel) {

        PaginatedResponse<IssueComponentDTO> response = reportService.getBloodComponentPaymentsReports(
                timeDuration, paymentMode,bloodGroup,technician,components,isGstAdded, startDate, endDate, page, size);

        if (exportExcel) {
            try {
                ByteArrayInputStream excelFile = reportService.generateBloodComponentExcelReport(response.getContent());
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=blood_component_report.xlsx");
                return ResponseEntity.ok()
                        .headers(headers)
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(excelFile);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating Excel report");
            }
        }

        // Otherwise, return the paginated response
        return ResponseEntity.ok(response);
    }

    @GetMapping("/blood/donor")
    public ResponseEntity<PaginatedResponse<BloodDonorDetailsDTO>> getBloodDonorReports(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) String donorName,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PaginatedResponse<BloodDonorDetailsDTO> response = reportService.getBloodDonorReports(
                timeDuration,paymentMode,donorName,bloodGroup, startDate, endDate, page, size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/blood/donor/download")
    public ResponseEntity<Resource> getBloodDonorReportsDownload(
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) String donorName,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws IOException {

        PaginatedResponse<BloodDonorDetailsDTO> response = reportService.getBloodDonorReports(
                timeDuration,paymentMode,donorName,bloodGroup, startDate, endDate, page, size);

        List<BloodDonorDetailsDTO> payments = response.getContent();
        ByteArrayInputStream in = reportService.generateBloodDonorReportsExcel(payments);
        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=blood_donor_details_report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

}


