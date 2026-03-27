package com.hms.services.bloodbankmanagement.service;


import com.hms.services.bloodbankmanagement.configuration.PatientManagementInterface;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_IssueBlood;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_IssueComponent;
import com.hms.services.bloodbankmanagement.model.*;
import com.hms.services.bloodbankmanagement.repository.DonorDetailsRepository;
import com.hms.services.bloodbankmanagement.repository.IssueBloodRepository;
import com.hms.services.bloodbankmanagement.repository.IssueComponentRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.BeanUtils;
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
import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private IssueBloodRepository issueBloodRepository;

    @Autowired
    private IssueComponentRepository issueComponentRepository;

    @Autowired
    private DonorDetailsRepository donorDetailsRepository;

    @Autowired
    private PatientManagementInterface patientManagementInterface;


    public PaginatedResponse<BloodIssuePaymentResponse> getBloodIssuePaymentsReports(
            String timeDuration,
            String paymentMode,
            String bloodGroup,
            String technician,
            Boolean isGstAdded,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size) {

        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        Pageable pageable = PageRequest.of(page, size, Sort.by("b.createdAt").descending());
        Page<HMS_TM_IssueBlood> pageResult = issueBloodRepository
                .findBloodIssuesWithFilters(paymentMode,bloodGroup,technician,isGstAdded, startDateTime, endDateTime, pageable);

        List<BloodIssuePaymentResponse> content = pageResult.getContent().stream().map(issue -> {
            BloodIssuePaymentResponse response = new BloodIssuePaymentResponse();
//            ResponseEntity<PatientsDTO> patientResponse = patientManagementInterface.getPatientById(issue.getPatientId());
//            response.setPatients(patientResponse.getBody());
            BeanUtils.copyProperties(issue, response);
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

    public PaginatedResponse<IssueComponentDTO> getBloodComponentPaymentsReports(String timeDuration, String paymentMode,String bloodGroup,String technician,String components, Boolean isGstAdded,
                                                                                 LocalDate startDate, LocalDate endDate, int page, int size) {

        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        Pageable pageable = PageRequest.of(page, size, Sort.by("b.createdAt").descending());

        Page<HMS_TM_IssueComponent> pageResult = issueComponentRepository
                .findBloodComponentWithFilters(paymentMode,bloodGroup,technician,components, isGstAdded, startDateTime, endDateTime, pageable);

        List<IssueComponentDTO> content = pageResult.getContent().stream().map(record -> {
            IssueComponentDTO response = new IssueComponentDTO();
            response.setIssueComponentId(record.getIssueComponentId());
            response.setPatientId(record.getPatientId());
            response.setCaseId(record.getCaseId());
            response.setIpdOrOpdId(record.getIpdOrOpdId());
            response.setIssueDate(record.getIssueDate());
            response.setHospitalDoctor(record.getHospitalDoctor());
            response.setReferenceName(record.getReferenceName());
            response.setTechnician(record.getTechnician());
            response.setBloodGroup(record.getBloodGroup());
            response.setComponents(record.getComponents());
            response.setComponentId(record.getComponentId());
            response.setChargeCategory(record.getChargeCategory());
            response.setChargeName(record.getChargeName());
            response.setStandardCharge(record.getStandardCharge());
            response.setNote(record.getNote());
            response.setTotal(record.getTotal());
            response.setDiscount(record.getDiscount());
            response.setTax(record.getTax());
            response.setNetAmount(record.getNetAmount());
            response.setPaymentMode(record.getPaymentMode());
            response.setPaymentAmount(record.getPaymentAmount());
            response.setBalanceAmount(record.getBalanceAmount());
            response.setChequeNo(record.getChequeNo());
            response.setChequeDate(record.getChequeDate());
            response.setAttachDocument(record.getAttachDocument());
            response.setGstAdded(record.isGstAdded());
            ResponseEntity<PatientsDTO> patientResponse = patientManagementInterface.getPatientById(record.getPatientId());
            response.setPatientDetails(patientResponse.getBody());
            return response;
        }).collect(Collectors.toList());

        return new PaginatedResponse<>(content, pageResult.getNumber(), pageResult.getSize(),
                pageResult.getTotalElements(), pageResult.getTotalPages());


    }


    public ByteArrayInputStream generateBloodIssuePaymentsExcel(List<BloodIssuePaymentResponse> payments) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Blood Issue Payments");

            // Header Row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Issue Blood ID");
            headerRow.createCell(1).setCellValue("Patient Name");
            headerRow.createCell(2).setCellValue("IPD/OPD ID");
            headerRow.createCell(3).setCellValue("Issue Date");
            headerRow.createCell(4).setCellValue("Hospital Doctor");
            headerRow.createCell(5).setCellValue("Blood Group");
            headerRow.createCell(6).setCellValue("Charge Category");
            headerRow.createCell(7).setCellValue("Charge Name");
            headerRow.createCell(8).setCellValue("Standard Charge");
            headerRow.createCell(9).setCellValue("Blood Quantity");
            headerRow.createCell(10).setCellValue("Net Amount");
            headerRow.createCell(11).setCellValue("Payment Mode");
            headerRow.createCell(12).setCellValue("Payment Amount");
            headerRow.createCell(13).setCellValue("Balance Amount");
            headerRow.createCell(14).setCellValue("GST Added");

            // Data Rows
            int rowIdx = 1;
            for (BloodIssuePaymentResponse payment : payments) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(payment.getIssueBloodId());
                row.createCell(1).setCellValue(payment.getPatients() != null ? payment.getPatients().getPatientId() : "");
                row.createCell(2).setCellValue(payment.getIpdOrOpdId());
                row.createCell(3).setCellValue(payment.getIssueDate() != null ? payment.getIssueDate().toString() : "");
                row.createCell(4).setCellValue(payment.getHospitalDoctor());
                row.createCell(5).setCellValue(payment.getBloodGroup());
                row.createCell(6).setCellValue(payment.getChargeCategory());
                row.createCell(7).setCellValue(payment.getChargeName());
                row.createCell(8).setCellValue(payment.getStandardCharge() != null ? payment.getStandardCharge() : 0.0);
                row.createCell(9).setCellValue(payment.getBloodQty() != null ? payment.getBloodQty() : 0);
                row.createCell(10).setCellValue(payment.getNetAmount() != null ? payment.getNetAmount() : 0.0);
                row.createCell(11).setCellValue(payment.getPaymentMode());
                row.createCell(12).setCellValue(payment.getPaymentAmount() != null ? payment.getPaymentAmount() : 0.0);
                row.createCell(13).setCellValue(payment.getBalanceAmount() != null ? payment.getBalanceAmount() : 0.0);
                row.createCell(14).setCellValue(payment.isGstAdded() ? "Yes" : "No");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream generateBloodComponentExcelReport(List<IssueComponentDTO> issueComponents) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Blood Component Reports");

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Issue Component ID");
            headerRow.createCell(1).setCellValue("Patient ID");
            headerRow.createCell(2).setCellValue("Case ID");
            headerRow.createCell(3).setCellValue("IPD/OPD ID");
            headerRow.createCell(4).setCellValue("Issue Date");
            headerRow.createCell(5).setCellValue("Hospital Doctor");
            headerRow.createCell(6).setCellValue("Technician");
            headerRow.createCell(7).setCellValue("Blood Group");
            headerRow.createCell(8).setCellValue("Charge Category");
            headerRow.createCell(9).setCellValue("Charge Name");
            headerRow.createCell(10).setCellValue("Standard Charge");
            headerRow.createCell(11).setCellValue("Total");
            headerRow.createCell(12).setCellValue("Discount");
            headerRow.createCell(13).setCellValue("Tax");
            headerRow.createCell(14).setCellValue("Net Amount");
            headerRow.createCell(15).setCellValue("Payment Mode");
            headerRow.createCell(16).setCellValue("Payment Amount");
            headerRow.createCell(17).setCellValue("Balance Amount");
            headerRow.createCell(18).setCellValue("Cheque No");
            headerRow.createCell(19).setCellValue("Cheque Date");
            headerRow.createCell(20).setCellValue("Attachment");
            headerRow.createCell(21).setCellValue("GST Added");

            // Fill data rows
            int rowIdx = 1;
            for (IssueComponentDTO component : issueComponents) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(component.getIssueComponentId());
                row.createCell(1).setCellValue(component.getPatientId());
                row.createCell(2).setCellValue(component.getCaseId());
                row.createCell(3).setCellValue(component.getIpdOrOpdId());
                row.createCell(4).setCellValue(component.getIssueDate() != null ? component.getIssueDate().toString() : "");
                row.createCell(5).setCellValue(component.getHospitalDoctor());
                row.createCell(6).setCellValue(component.getTechnician());
                row.createCell(7).setCellValue(component.getBloodGroup());
                row.createCell(8).setCellValue(component.getChargeCategory());
                row.createCell(9).setCellValue(component.getChargeName());
                row.createCell(10).setCellValue(component.getStandardCharge() != null ? component.getStandardCharge() : 0.0);
                row.createCell(11).setCellValue(component.getTotal() != null ? component.getTotal() : 0.0);
                row.createCell(12).setCellValue(component.getDiscount() != null ? component.getDiscount() : 0.0);
                row.createCell(13).setCellValue(component.getTax() != null ? component.getTax() : 0.0);
                row.createCell(14).setCellValue(component.getNetAmount() != null ? component.getNetAmount() : 0.0);
                row.createCell(15).setCellValue(component.getPaymentMode());
                row.createCell(16).setCellValue(component.getPaymentAmount() != null ? component.getPaymentAmount() : 0.0);
                row.createCell(17).setCellValue(component.getBalanceAmount() != null ? component.getBalanceAmount() : 0.0);
                row.createCell(18).setCellValue(component.getChequeNo());
                row.createCell(19).setCellValue(component.getChequeDate() != null ? component.getChequeDate().toString() : "");
                row.createCell(20).setCellValue(component.getAttachDocument());
                row.createCell(21).setCellValue(component.isGstAdded() ? "Yes" : "No");
            }

            // Write to ByteArrayOutputStream
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


    public PaginatedResponse<BloodDonorDetailsDTO> getBloodDonorReports(String timeDuration, String paymentMode, String donorName, String bloodGroup, LocalDate startDate, LocalDate endDate, int page, int size) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        Pageable pageable = PageRequest.of(page, size);

        Page<BloodDonorDetailsDTO> pageResult = donorDetailsRepository
                .findBloodDonorsWithFilters(donorName, bloodGroup,paymentMode, startDateTime, endDateTime, pageable);
        return new PaginatedResponse<>(pageResult.getContent(), pageResult.getNumber(), pageResult.getSize(),
                pageResult.getTotalElements(), pageResult.getTotalPages());
    }

    public ByteArrayInputStream generateBloodDonorReportsExcel(List<BloodDonorDetailsDTO> donors) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Blood Donor Details");

            // Header Row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Donor Name");
            headerRow.createCell(1).setCellValue("Blood Group");
            headerRow.createCell(2).setCellValue("Donate Date");
            headerRow.createCell(3).setCellValue("Bag No.");
            headerRow.createCell(4).setCellValue("Charge Category");
            headerRow.createCell(5).setCellValue("Charge Name");
            headerRow.createCell(6).setCellValue("Standard Charge");
            headerRow.createCell(7).setCellValue("Total");
            headerRow.createCell(8).setCellValue("Discount");
            headerRow.createCell(9).setCellValue("Tax");
            headerRow.createCell(10).setCellValue("Net Amount");
            headerRow.createCell(11).setCellValue("Payment Mode");
            headerRow.createCell(12).setCellValue("Payment Amount");
            headerRow.createCell(13).setCellValue("Balance Amount");

            // Data Rows
            int rowIdx = 1;
            for (BloodDonorDetailsDTO donor : donors) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(donor.getDonorDetails() != null ? donor.getDonorDetails().getDonorName() : "");
                row.createCell(1).setCellValue(donor.getDonorDetails().getBloodGroup() != null ? donor.getDonorDetails().getBloodGroup() : "");
                row.createCell(2).setCellValue(donor.getDonateDate() != null ? donor.getDonateDate().toString() : "");
                row.createCell(3).setCellValue(donor.getBag() != null ? donor.getBag() : "");
                row.createCell(4).setCellValue(donor.getChargeCategory() != null ? donor.getChargeCategory() : "");
                row.createCell(5).setCellValue(donor.getChargeName() != null ? donor.getChargeName() : "");
                row.createCell(6).setCellValue(donor.getStandardCharge() != null ? donor.getStandardCharge().doubleValue() : 0.0);
                row.createCell(7).setCellValue(donor.getTotal() != null ? donor.getTotal().doubleValue() : 0.0);
                row.createCell(8).setCellValue(donor.getDiscount() != null ? donor.getDiscount().doubleValue() : 0.0);
                row.createCell(9).setCellValue(donor.getTax() != null ? donor.getTax().doubleValue() : 0.0);
                row.createCell(10).setCellValue(donor.getNetAmount() != null ? donor.getNetAmount().doubleValue() : 0.0);
                row.createCell(11).setCellValue(donor.getPaymentMode() != null ? donor.getPaymentMode() : "");
                row.createCell(12).setCellValue(donor.getPaymentAmount() != null ? donor.getPaymentAmount().doubleValue() : 0.0);
                row.createCell(13).setCellValue(donor.getBalanceAmount() != null ? donor.getBalanceAmount().doubleValue() : 0.0);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

}


