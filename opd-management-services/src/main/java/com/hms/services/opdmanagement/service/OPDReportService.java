package com.hms.services.opdmanagement.service;

import com.hms.services.opdmanagement.configuration.AdminManagementInterface;
import com.hms.services.opdmanagement.configuration.ConnectionInterface;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDAdmissions;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDCharges;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDPayments;
import com.hms.services.opdmanagement.model.*;
import com.hms.services.opdmanagement.repository.OPDAdmissionsRepository;
import com.hms.services.opdmanagement.response.OPDReportResponseDTO;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import java.io.ByteArrayOutputStream;
import org.apache.poi.ss.usermodel.Row;

@Service
public class OPDReportService {

    @Autowired
    private OPDAdmissionsRepository opdAdmissionsRepository;

    @Autowired
    private ConnectionInterface patientClient;

    @Autowired
    private AdminManagementInterface adminClient;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private AdminManagementInterface adminManagementInterface;




    public List<OPDReportResponseDTO> getOPDReports(
            String timeDuration, String doctorId, String symptoms, LocalDate startDate, LocalDate endDate) {

        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        List<HMS_TM_OPDAdmissions> admissions = opdAdmissionsRepository.findOPDAdmissions(
                doctorId, symptoms, startDateTime, endDateTime);

        return admissions.stream().map(admission -> {
            OPDReportResponseDTO dto = new OPDReportResponseDTO();
            dto.setOpdNo(admission.getOpdId());
            dto.setDate(admission.getAppointmentDate());

            ResponseEntity<OPDCombinedDTO.PatientDTO> patientResponse =
                    patientClient.getPatientById(admission.getPatientId());
            if (patientResponse.getBody() != null) {
                String fullName = patientResponse.getBody().getFirstName() + " " + patientResponse.getBody().getLastName();
                dto.setPatientName(fullName.trim());
                String ageString = patientResponse.getBody().getAge();
                String numericAge = ageString.replaceAll("[^0-9]", " ").trim().split(" ")[0];
                if(numericAge!=null) {
                int age = Integer.parseInt(numericAge);
                dto.setAge(age);
                }
                dto.setGender(patientResponse.getBody().getGender());
                dto.setMobileNumber(patientResponse.getBody().getContactNumber());
            }

            ResponseEntity<EmployeeDetails> doctorResponse = adminClient.getEmployeeById(admission.getDoctorId());
            if (doctorResponse.getBody() != null) {
                dto.setDoctorName(doctorResponse.getBody().getFirstName());
            }

            dto.setGuardianName(admission.getGuardianName());
            dto.setSymptoms(admission.getSymptomsTitle());

            dto.setAntenatal(admission.isAntenatal());
            dto.setPreviousMedicalIssue(admission.getPreviousMedicalIssue());

            return dto;
        }).collect(Collectors.toList());
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

        @Transactional
        public PaginatedResponse<OPDChargesReportDTO> getOPDChargesReports(String timeDuration, String doctorId,
                                                                                    String symptoms, boolean isGstAdded,
                                                                                    LocalDate startDate, LocalDate endDate,
                                                                                    int page, int size) {

            LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
            LocalDateTime startDateTime = dateRange[0];
            LocalDateTime endDateTime = dateRange[1];

            Pageable pageable = PageRequest.of(page, size);

            Page<OPDChargeWithPatientDTO> admissionsPage = opdAdmissionsRepository.findOPDChargesWithFiltersPaginated(
                    doctorId, symptoms, isGstAdded, startDateTime, endDateTime, pageable);
            List<OPDChargesReportDTO> content = admissionsPage.stream().map(admission -> {
                OPDChargesReportDTO chargeDTO = modelMapper.map(admission.getOpdCharge(), OPDChargesReportDTO.class);
                ResponseEntity<OPDCombinedDTO.PatientDTO> patientResponse = patientClient.getPatientById(admission.getPatientId());
                String insuranceId = null;
                if (patientResponse != null && patientResponse.getBody() != null) {
                    OPDCombinedDTO.PatientDTO patient = patientResponse.getBody();
                    if (patient.getInsuranceProviders() != null) {
                        insuranceId = patient.getInsuranceProviders().getInsuranceId();
                    }
                }
                ResponseEntity<OPDCombinedDTO.CombinedCharges> chargesTypeResponse =
                        adminManagementInterface.getAllByChargeId(admission.getOpdCharge().getChargeNameId(), insuranceId);
                OPDCombinedDTO.CombinedCharges chargesType = chargesTypeResponse.getBody();

                if (chargesType != null) {
                    OPDChargesReportDTO.CombinedCharges charges =new OPDChargesReportDTO.CombinedCharges();
                    charges.setChargeCategory(chargesType.getChargeCategory());
                    charges.setChargeName(chargesType.getChargeName());
                    charges.setChargeType(chargesType.getChargeType());
                    charges.setScheduleCharges(chargesType.getScheduleCharges());
                    charges.setStandardCharge(chargesType.getStandardCharge());
                    charges.setUnitType(chargesType.getUnitType());
                    chargeDTO.setCombinedCharges(charges);
                }

                chargeDTO.setPatients(patientResponse.getBody());

    if(admission.getDoctorId()!=null) {
    ResponseEntity<EmployeeDetails> doctorResponse = adminClient.getEmployeeById(admission.getDoctorId());
    if (doctorResponse.getBody() != null) {
        chargeDTO.setDoctorName(doctorResponse.getBody().getFirstName() + " " + doctorResponse.getBody().getLastName());
    }
}
                return chargeDTO;
            }).collect(Collectors.toList());

            return new PaginatedResponse<>(
                    content,
                    admissionsPage.getNumber(),
                    admissionsPage.getSize(),
                    admissionsPage.getTotalElements(),
                    admissionsPage.getTotalPages()
            );
        }


    public PaginatedResponse<PaymentResponse> getOPDPaymentsReports(String timeDuration, String paymentMode,
                                                                    LocalDate startDate, LocalDate endDate,
                                                                    int page, int size) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<OPDPaymentsWithPatientDTO> admissionsPage = opdAdmissionsRepository.findOPDPaymentsWithFilters(
                paymentMode, startDateTime, endDateTime, pageable
        );

        List<PaymentResponse> content = admissionsPage.getContent().stream().map(admission -> {
            PaymentResponse payments = modelMapper.map(admission.getPayments(), PaymentResponse.class);
            ResponseEntity<OPDCombinedDTO.PatientDTO> patientResponse =
                    patientClient.getPatientById(admission.getPatientId());
            payments.setPatients(patientResponse.getBody());
            return payments;
        }).collect(Collectors.toList());

        return new PaginatedResponse<>(content, page, size, admissionsPage.getTotalElements(), admissionsPage.getTotalPages());
    }


    public ByteArrayInputStream generatePaymentsExcel(List<PaymentResponse> payments) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Payments");

            // Header Row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Date");
            headerRow.createCell(1).setCellValue("Transaction ID");
            headerRow.createCell(2).setCellValue("Patient Name");
            headerRow.createCell(3).setCellValue("Age");
            headerRow.createCell(4).setCellValue("Gender");
            headerRow.createCell(5).setCellValue("Mobile Number");
            headerRow.createCell(6).setCellValue("Payment Mode");
            headerRow.createCell(7).setCellValue("Amount");

            // Data Rows
            int rowIdx = 1;
            for (PaymentResponse payment : payments) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(payment.getDate().toString()); // Date
                row.createCell(1).setCellValue(payment.getTransactionId()); // Transaction ID
                row.createCell(2).setCellValue(payment.getPatients().getFirstName() + " " + payment.getPatients().getLastName()); // Patient Name
                row.createCell(3).setCellValue(payment.getPatients().getAge()); // Age
                row.createCell(4).setCellValue(payment.getPatients().getGender()); // Gender
                row.createCell(5).setCellValue(payment.getPatients().getContactNumber()); // Mobile Number
                row.createCell(6).setCellValue(payment.getPaymentMode()); // Payment Mode
                row.createCell(7).setCellValue(payment.getAmount().toString()); // Amount

            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream generateChargesExcel(List<OPDChargesReportDTO> charges) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("OPD Charges");

            // Header Row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Date");
            headerRow.createCell(1).setCellValue("OPD No");
            headerRow.createCell(2).setCellValue("Patient Name");
            headerRow.createCell(3).setCellValue("Doctor Name");
            headerRow.createCell(4).setCellValue("Charge Name");
            headerRow.createCell(5).setCellValue("Charge Type");
            headerRow.createCell(6).setCellValue("Charge Category");
            headerRow.createCell(7).setCellValue("GST");
            headerRow.createCell(8).setCellValue("Total Amount");
            headerRow.createCell(9).setCellValue("Tax Amount");
            headerRow.createCell(10).setCellValue("Paid Amount");


            // Data Rows
            int rowIdx = 1;
            for (OPDChargesReportDTO charge : charges) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(charge.getDate().toString());
                row.createCell(1).setCellValue(charge.getOpdId());
                if (charge.getPatients() != null) {
                    row.createCell(2).setCellValue(charge.getPatients().getFirstName() + " " + charge.getPatients().getLastName());
                }
                row.createCell(3).setCellValue(charge.getDoctorName());
                if(charge.getCombinedCharges()!=null) {
                    row.createCell(4).setCellValue(charge.getCombinedCharges().getChargeName());
                    row.createCell(5).setCellValue(charge.getCombinedCharges().getChargeType().getChargeType());
                    row.createCell(6).setCellValue(charge.getCombinedCharges().getChargeCategory().getName());
                }
                row.createCell(7).setCellValue(charge.isGstAdded() ? "Paid" : "Not Paid");
                row.createCell(8).setCellValue(charge.getTotal().toString());
                row.createCell(9).setCellValue(charge.getTaxAmount().toString());
                row.createCell(10).setCellValue(charge.getNetAmount().toString());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


    public ByteArrayInputStream generateOPDReportsExcel(List<OPDReportResponseDTO> reports) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("OPD Reports");

            // Header Row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("OPD No");
            headerRow.createCell(1).setCellValue("Date");
            headerRow.createCell(2).setCellValue("Patient Name");
            headerRow.createCell(3).setCellValue("Age");
            headerRow.createCell(4).setCellValue("Gender");
            headerRow.createCell(5).setCellValue("Mobile Number");
            headerRow.createCell(6).setCellValue("Doctor Name");
            headerRow.createCell(7).setCellValue("Guardian Name");
            headerRow.createCell(8).setCellValue("Symptoms");
            headerRow.createCell(9).setCellValue("Antenatal");
            headerRow.createCell(10).setCellValue("Previous Medical Issue");

            // Data Rows
            int rowIdx = 1;
            for (OPDReportResponseDTO report : reports) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(report.getOpdNo());
                row.createCell(1).setCellValue(report.getDate().toString());
                row.createCell(2).setCellValue(report.getPatientName());
                row.createCell(3).setCellValue(Optional.ofNullable(report.getAge()).orElse(0));
                row.createCell(4).setCellValue(report.getGender());
                row.createCell(5).setCellValue(report.getMobileNumber());
                row.createCell(6).setCellValue(report.getDoctorName());
                row.createCell(7).setCellValue(report.getGuardianName());
                row.createCell(8).setCellValue(report.getSymptoms());
                row.createCell(9).setCellValue(report.getAntenatal() ? "Yes" : "No");
                row.createCell(10).setCellValue(report.getPreviousMedicalIssue());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }



}

