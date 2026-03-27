package com.hms.services.ambulancemanagement.service;

import com.hms.services.ambulancemanagement.configuration.ConnectionInterface;
import com.hms.services.ambulancemanagement.entity.HMS_TM_AddAmbulanceCall;
import com.hms.services.ambulancemanagement.entity.HMS_TM_AddVehicle;
import com.hms.services.ambulancemanagement.entity.HMS_TM_AmbulanceCallTransaction;
import com.hms.services.ambulancemanagement.model.AmbulancePaymentResponse;
import com.hms.services.ambulancemanagement.model.AmbulancePaymentsWithPatientDTO;
import com.hms.services.ambulancemanagement.model.PaginatedResponse;
import com.hms.services.ambulancemanagement.model.PatientsDTO;
import com.hms.services.ambulancemanagement.repository.AmbulanceCallTransactionRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AmbulanceReportService {

    @Autowired
    AmbulanceCallTransactionRepository ambulanceCallTransactionRepository;
    @Autowired
    ConnectionInterface connectionInterface;



    public PaginatedResponse<AmbulancePaymentResponse> getAmbulancePaymentsReports(
            String timeDuration,
            String paymentMode,
            boolean isGstAdded,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size) {

        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        Pageable pageable = PageRequest.of(page, size, Sort.by("t.createdAt").descending());
        Page<AmbulancePaymentsWithPatientDTO> pageResult = ambulanceCallTransactionRepository
                .findAmbulancePaymentsWithFilters(paymentMode,isGstAdded, startDateTime, endDateTime, pageable);

        List<AmbulancePaymentResponse> content = pageResult.getContent().stream().map(record -> {
            AmbulancePaymentResponse response = new AmbulancePaymentResponse();
            HMS_TM_AmbulanceCallTransaction t = record.getTransaction();
            HMS_TM_AddAmbulanceCall c = record.getAmbulanceCall();
            HMS_TM_AddVehicle v = record.getVehicle();

            response.setPaymentId(t.getPaymentId());
            response.setVehicleChargeId(t.getVehicleChargeId());
            response.setPaymentMode(t.getPaymentMode());
            response.setPaymentAmount(t.getPaymentAmount());
            response.setCheckNo(t.getCheckNo());
            response.setCheckDate(t.getCheckDate());
            response.setAttachment(t.getAttachment());
            response.setDate(t.getDate());

            response.setBillNo(c.getBillNo());
            response.setTotal(c.getTotal());
            response.setDiscountAmount(c.getDiscountAmount());
            response.setNetAmount(c.getNetAmount());

            response.setVehicleModel(v.getVehicleModel());
            response.setVehicleNumber(v.getVehicleNumber());
            response.setDriverName(v.getDriverName());

            // Fetch patient details
            ResponseEntity<PatientsDTO> patientResponse = connectionInterface.getPatientById(c.getPatientId());
            response.setPatient(patientResponse.getBody());

            return response;
        }).collect(Collectors.toList());

        return new PaginatedResponse<>(content, pageResult.getNumber(), pageResult.getSize(),
                pageResult.getTotalElements(), pageResult.getTotalPages());
    }


    private LocalDateTime[] calculateDateRange(String timeDuration, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        LocalDateTime now = LocalDateTime.now();

        if (timeDuration != null) {
            switch (timeDuration.toUpperCase()) {
                case "DAILY":
                    startDateTime = now.toLocalDate().atStartOfDay();
                    endDateTime = now.toLocalDate().atTime(23, 59, 59);
                    break;
                case "WEEKLY":
                    startDateTime = now.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();
                    endDateTime = now.toLocalDate().with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).atTime(23, 59, 59);
                    break;
                case "MONTHLY":
                    startDateTime = now.toLocalDate().withDayOfMonth(1).atStartOfDay();
                    endDateTime = now.toLocalDate().with(TemporalAdjusters.lastDayOfMonth()).atTime(23, 59, 59);
                    break;
                case "YEARLY":
                    startDateTime = now.toLocalDate().withDayOfYear(1).atStartOfDay();
                    endDateTime = now.toLocalDate().with(TemporalAdjusters.lastDayOfYear()).atTime(23, 59, 59);
                    break;
                case "LAST_YEAR":
                    LocalDate lastYear = now.toLocalDate().minusYears(1);
                    startDateTime = lastYear.withDayOfYear(1).atStartOfDay();
                    endDateTime = lastYear.with(TemporalAdjusters.lastDayOfYear()).atTime(23, 59, 59);
                    break;
                case "CUSTOM":
                    startDateTime = (startDate != null) ? startDate.atStartOfDay() : null;
                    endDateTime = (endDate != null) ? endDate.atTime(23, 59, 59) : null;
                    break;
            }
        } else if (startDate != null || endDate != null) {
            startDateTime = (startDate != null) ? startDate.atStartOfDay() : null;
            endDateTime = (endDate != null) ? endDate.atTime(23, 59, 59) : null;
        }

        return new LocalDateTime[]{startDateTime, endDateTime};
    }

    public ByteArrayInputStream generateAmbulancePaymentsExcel(List<AmbulancePaymentResponse> payments) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Ambulance Payments");

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Payment ID");
            headerRow.createCell(1).setCellValue("Vehicle Charge ID");
            headerRow.createCell(2).setCellValue("Payment Mode");
            headerRow.createCell(3).setCellValue("Payment Amount");
            headerRow.createCell(4).setCellValue("Check No");
            headerRow.createCell(5).setCellValue("Check Date");
            headerRow.createCell(6).setCellValue("Payment Date");
            headerRow.createCell(7).setCellValue("Bill No");
            headerRow.createCell(8).setCellValue("Total");
            headerRow.createCell(9).setCellValue("Discount Amount");
            headerRow.createCell(10).setCellValue("Net Amount");
            headerRow.createCell(11).setCellValue("Vehicle Model");
            headerRow.createCell(12).setCellValue("Vehicle Number");
            headerRow.createCell(13).setCellValue("Driver Name");

            // Data Rows
            int rowIdx = 1;
            for (AmbulancePaymentResponse payment : payments) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(payment.getPaymentId());
                row.createCell(1).setCellValue(payment.getVehicleChargeId());
                row.createCell(2).setCellValue(payment.getPaymentMode());
                row.createCell(3).setCellValue(payment.getPaymentAmount());
                row.createCell(4).setCellValue(payment.getCheckNo());
                row.createCell(5).setCellValue(payment.getCheckDate() != null ? payment.getCheckDate().toString() : "");
                row.createCell(6).setCellValue(payment.getDate().toString());
                row.createCell(7).setCellValue(payment.getBillNo());
                row.createCell(8).setCellValue(payment.getTotal());
                row.createCell(9).setCellValue(payment.getDiscountAmount());
                row.createCell(10).setCellValue(payment.getNetAmount());
                row.createCell(11).setCellValue(payment.getVehicleModel());
                row.createCell(12).setCellValue(payment.getVehicleNumber());
                row.createCell(13).setCellValue(payment.getDriverName());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


}


