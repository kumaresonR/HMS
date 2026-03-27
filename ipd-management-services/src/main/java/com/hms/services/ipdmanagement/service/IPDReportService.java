package com.hms.services.ipdmanagement.service;

import com.hms.services.ipdmanagement.configuration.AdminManagementInterface;
import com.hms.services.ipdmanagement.configuration.ConnectionInterface;
import com.hms.services.ipdmanagement.entity.HMS_TM_IPDAdmissions;
import com.hms.services.ipdmanagement.model.*;
import com.hms.services.ipdmanagement.repository.*;
import com.hms.services.ipdmanagement.response.IPDReportResponseDTO;
import org.apache.poi.ss.usermodel.Row;
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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IPDReportService {

    @Autowired
    private IPDAdmissionsRepository ipdAdmissionsRepository;

    @Autowired
    private ConnectionInterface patientClient;

    @Autowired
    private AdminManagementInterface adminClient;

    @Autowired
    private BedGroupRepository bedGroupRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private IPDChargesRepository ipdChargesRepository;

    @Autowired
    private IPDPaymentsRepository paymentsRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<IPDReportResponseDTO> getIPDReports(
            String timeDuration, String doctorId, String symptoms, LocalDate startDate, LocalDate endDate) {

        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        List<HMS_TM_IPDAdmissions> admissions = ipdAdmissionsRepository.findIPDAdmissions(
                doctorId, symptoms, startDateTime, endDateTime);

        return admissions.stream().map(admission -> {
            IPDReportResponseDTO dto = new IPDReportResponseDTO();
            dto.setIpdNo(admission.getIpdId());
            dto.setDate(admission.getAdmissionDate());

            ResponseEntity<IPDCombinedDTO.PatientDTO> patientResponse =
                    patientClient.getPatientById(admission.getPatientId());
            if (patientResponse.getBody() != null) {
                String fullName = patientResponse.getBody().getFirstName() + " " + patientResponse.getBody().getLastName();
                dto.setPatientName(fullName.trim());
                String ageString = patientResponse.getBody().getAge();
                String numericAge = ageString.replaceAll("[^0-9]", " ").trim().split(" ")[0];
                int age = Integer.parseInt(numericAge);
                dto.setAge(age);
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


    public PaginatedResponse<IPDChargesReportDTO> getIPDChargesReports(String timeDuration, String doctorId, String symptoms,
                                                                       boolean isGstAdded, LocalDate startDate, LocalDate endDate,
                                                                       int page, int size) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        Pageable pageable = PageRequest.of(page, size);

        Page<IPDChargeWithPatientDTO> admissionsPage = ipdAdmissionsRepository.findIPDChargesWithFiltersPaged(
                doctorId, symptoms, isGstAdded, dateRange[0], dateRange[1], pageable);

        List<IPDChargesReportDTO> resultList = admissionsPage.getContent().stream().map(admission -> {
            IPDChargesReportDTO chargeDTO = modelMapper.map(admission.getIpdCharge(), IPDChargesReportDTO.class);

            ResponseEntity<IPDCombinedDTO.PatientDTO> patientResponse = patientClient.getPatientById(admission.getPatientId());
            chargeDTO.setPatients(patientResponse.getBody());

            String insuranceId = null;
            if (patientResponse != null && patientResponse.getBody() != null) {
                IPDCombinedDTO.PatientDTO patient = patientResponse.getBody();
                if (patient.getInsuranceProviders() != null) {
                    insuranceId = patient.getInsuranceProviders().getInsuranceId();
                }
            }

            ResponseEntity<IPDCombinedDTO.CombinedCharges> chargesTypeResp =
                    adminClient.getAllByChargeId(admission.getIpdCharge().getChargeNameId(), insuranceId);

            if (chargesTypeResp.getBody() != null) {
                IPDCombinedDTO.CombinedCharges chargesType = chargesTypeResp.getBody();
                IPDChargesReportDTO.CombinedCharges charges =new IPDChargesReportDTO.CombinedCharges();
                charges.setChargeCategory(chargesType.getChargeCategory());
                charges.setChargeName(chargesType.getChargeName());
                charges.setChargeType(chargesType.getChargeType());
                charges.setScheduleCharges(chargesType.getScheduleCharges());
                charges.setStandardCharge(chargesType.getStandardCharge());
                charges.setUnitType(chargesType.getUnitType());
                chargeDTO.setCombinedCharges(charges);
            }
if(admission.getDoctorId()!=null) {
    ResponseEntity<EmployeeDetails> doctorResponse = adminClient.getEmployeeById(admission.getDoctorId());
    if (doctorResponse.getBody() != null) {
        chargeDTO.setDoctorName(doctorResponse.getBody().getFirstName() + " " + doctorResponse.getBody().getLastName());
    }
}
            return chargeDTO;
        }).collect(Collectors.toList());

//        int firstRecord = page * size + 1;
//        int lastRecord = firstRecord + resultList.size() - 1;

        return new PaginatedResponse<>(
                resultList,
                page,
                size,
                admissionsPage.getTotalElements(),
                admissionsPage.getTotalPages()
        );

    }



    public PaginatedResponse<PaymentResponse> getIPDPaymentsReports(String timeDuration, String paymentMode, LocalDate startDate, LocalDate endDate,int page, int size) {
        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<IPDPaymentsWithPatientDTO> admissionsPage =
                ipdAdmissionsRepository.findIPDPaymentsWithFilters(paymentMode, startDateTime, endDateTime, pageable);

        List<PaymentResponse> content = admissionsPage.getContent().stream().map(admission -> {
            PaymentResponse payments = modelMapper.map(admission.getPayments(), PaymentResponse.class);
            ResponseEntity<IPDCombinedDTO.PatientDTO> patientResponse = patientClient.getPatientById(admission.getPatientId());
            payments.setPatients(patientResponse.getBody());
            return payments;
        }).collect(Collectors.toList());

        PaginatedResponse<PaymentResponse> response = new PaginatedResponse<>(
                content,
                admissionsPage.getNumber(),
                admissionsPage.getSize(),
                admissionsPage.getTotalElements(),
                admissionsPage.getTotalPages()
        );
        return response;
    }


    public ByteArrayInputStream generateOPDPaymentsExcel(List<PaymentResponse> payments) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("OPD Payments");

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
                row.createCell(7).setCellValue(payment.getAmount().toString());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


    public ByteArrayInputStream generateIPDChargesExcel(List<IPDChargesReportDTO> charges) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("IPD Charges");

            // Header Row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Date");
            headerRow.createCell(1).setCellValue("IPD No");
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
            for (IPDChargesReportDTO charge : charges) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(charge.getDate().toString()); // Date
                row.createCell(1).setCellValue(charge.getIpdId()); // OPD No
                if (charge.getPatients() != null) {
                    row.createCell(2).setCellValue(charge.getPatients().getFirstName() + " " + charge.getPatients().getLastName()); // Patient Name
                }
                row.createCell(3).setCellValue(charge.getDoctorName()); // Doctor Name
                if(charge.getCombinedCharges()!=null) {
                    row.createCell(4).setCellValue(charge.getCombinedCharges().getChargeName()); // Charge Name
                    row.createCell(5).setCellValue(charge.getCombinedCharges().getChargeType().getChargeType()); // Charge Type
                    row.createCell(6).setCellValue(charge.getCombinedCharges().getChargeCategory().getName()); // Charge Category
                }
                row.createCell(7).setCellValue(charge.isGstAdded() ? "Paid" : "Not Paid"); // GST
                row.createCell(8).setCellValue(charge.getTotal().toString()); // Total Amount
                row.createCell(9).setCellValue(charge.getTaxAmount().toString()); // Tax Amount
                row.createCell(10).setCellValue(charge.getNetAmount().toString()); //
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


    public ByteArrayInputStream generateIPDReportExcel(List<IPDReportResponseDTO> ipdReports) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("IPD Report");

            // Header Row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("IPD No");
            headerRow.createCell(1).setCellValue("Patient Name");
            headerRow.createCell(2).setCellValue("Age");
            headerRow.createCell(3).setCellValue("Gender");
            headerRow.createCell(4).setCellValue("Mobile Number");
            headerRow.createCell(5).setCellValue("Doctor Name");
            headerRow.createCell(6).setCellValue("Guardian Name");
            headerRow.createCell(7).setCellValue("Symptoms");
            headerRow.createCell(8).setCellValue("Antenatal");
            headerRow.createCell(9).setCellValue("Previous Medical Issue");
            headerRow.createCell(10).setCellValue("Admission Date");

            // Data Rows
            int rowIdx = 1;
            for (IPDReportResponseDTO report : ipdReports) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(report.getIpdNo());
                row.createCell(1).setCellValue(report.getPatientName());
                row.createCell(2).setCellValue(Optional.ofNullable(report.getAge()).orElse(0));
                row.createCell(3).setCellValue(report.getGender());
                row.createCell(4).setCellValue(report.getMobileNumber());
                row.createCell(5).setCellValue(report.getDoctorName());
                row.createCell(6).setCellValue(report.getGuardianName());
                row.createCell(7).setCellValue(report.getSymptoms());
                row.createCell(8).setCellValue(report.getAntenatal() ? "Yes" : "No");
                row.createCell(9).setCellValue(report.getPreviousMedicalIssue());
                row.createCell(10).setCellValue(report.getDate().toString());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

}

















//    public List<IPDBalanceResponseDTO> getIPDBalanceReport(
//            String timeDuration, String patientStatus, LocalDate startDate, LocalDate endDate) {
//
//        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
//        LocalDateTime startDateTime = dateRange[0];
//        LocalDateTime endDateTime = dateRange[1];
//
//        List<HMS_TM_IPDAdmissions> admissions = ipdAdmissionsRepository.findIPDAdmissionsByStatus(
//                patientStatus, startDateTime, endDateTime);
//
//        return admissions.stream().map(admission -> {
//            IPDBalanceResponseDTO dto = new IPDBalanceResponseDTO();
//            dto.setIpdNo(admission.getIpdId());
//            dto.setCaseId(admission.getCaseId());
//            dto.setGuardianName(admission.getGuardianName());
//            dto.setAntenatal(admission.isAntenatal());
//
//            dto.setDischarged((admission.getDischargeDate() != null) ? "Yes" : "No");
//
//            ResponseEntity<IPDCombinedDTO.PatientDTO> patientResponse =
//                    patientClient.getPatientById(admission.getPatientId());
//            if (patientResponse.getBody() != null) {
//                dto.setPatientName(patientResponse.getBody().getFirstName());
//                dto.setAge(Integer.valueOf(patientResponse.getBody().getAge()));
//                dto.setGender(patientResponse.getBody().getGender());
//                dto.setMobileNumber(patientResponse.getBody().getContactNumber());
//            }
//
//            Double netAmount = ipdChargesRepository.getNetAmountByIpdId(admission.getIpdId());
//            Double paidAmount = paymentsRepository.getPaidAmountByIpdId(admission.getIpdId());
//            Double balanceAmount = (netAmount != null ? netAmount : 0.0) - (paidAmount != null ? paidAmount : 0.0);
//
//            dto.setNetAmount(netAmount);
//            dto.setPaidAmount(paidAmount);
//            dto.setBalanceAmount(balanceAmount);
//
//            return dto;
//        }).collect(Collectors.toList());
//    }
//

//    public List<PatientReportResponse> searchAdmissions(
//            String doctorName,
//            String timeDuration,
//            LocalDate startDate,
//            LocalDate endDate) {
//
//        if (startDate == null) {
//            startDate = LocalDate.now();
//        }
//        if (endDate == null) {
//            endDate = LocalDate.now();
//        }
//
//        LocalDate[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
//
//        if (dateRange[0] == null || dateRange[1] == null) {
//            throw new IllegalStateException("Calculated date range contains null values.");
//        }
//
//        LocalDateTime startDateTime = dateRange[0].atStartOfDay();
//        LocalDateTime endDateTime = dateRange[1].atStartOfDay();
//
//        List<HMS_TM_IPDAdmissions> admissions = ipdAdmissionsRepository.findAdmissionsWithFilters(
//                startDateTime,
//                endDateTime
//        );
//
//        Set<PatientReportResponse> responseSet = new HashSet<>();
//
//        for (HMS_TM_IPDAdmissions admission : admissions) {
//            responseSet.addAll(convertToResponse(admission));
//        }
//
//        return new ArrayList<>(responseSet);
//    }
//
//
//    private List<PatientReportResponse> convertToResponse(HMS_TM_IPDAdmissions admission) {
//        List<PatientReportResponse> responses = new ArrayList<>();
//
//        IPDCombinedDTO.PatientDTO patient = patientClient.getPatientById(admission.getPatientId()).getBody();
//        String patientName = patient != null ? patient.getFirstName() + " " + patient.getLastName() : "Unknown";
//
//        HMS_TM_BedGroup bedGroup = bedGroupRepository.findById(admission.getRoomId()).orElse(null);
//        String bed = bedGroup != null ? bedGroup.getBedGroupName() : "Unknown";
//
//        long admitDays = Duration.between(admission.getAdmissionDate(), admission.getDischargeDate()).toDays();
//
//        PatientReportResponse response = new PatientReportResponse();
//        response.setPatientName(patientName);
//        response.setIpdId(admission.getIpdId());
//        response.setCaseId(admission.getCaseId());
//        response.setGender(patient != null ? patient.getGender() : "Unknown");
//        response.setPhone(patient != null ? patient.getPatientId() : "Unknown");
//        response.setAntenatal(admission.isAntenatal());
//        response.setConsultantDoctor(admission.getDoctorId());
//        response.setBed(bed);
//        response.setAdmissionDate(admission.getAdmissionDate());
//        response.setDischargedDate(admission.getDischargeDate());
//        response.setDischargeStatus(admission.getDischargeStatus());
//        response.setTotalAdmitDays(admitDays);
//
//        responses.add(response);
//
//        return responses;
//    }



