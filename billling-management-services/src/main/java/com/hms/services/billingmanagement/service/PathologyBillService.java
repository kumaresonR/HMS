package com.hms.services.billingmanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.billingmanagement.configuration.IpdInterface;
import com.hms.services.billingmanagement.configuration.LaboratoryManagementInterface;
import com.hms.services.billingmanagement.configuration.OpdInterface;
import com.hms.services.billingmanagement.configuration.PatientManagementInterface;
import com.hms.services.billingmanagement.entity.HMS_TM_PathologyBill;
import com.hms.services.billingmanagement.entity.HMS_TM_PathologyTest;
import com.hms.services.billingmanagement.entity.HMS_TM_Pathology_Parameters;
import com.hms.services.billingmanagement.exceptionhandler.CustomException;
import com.hms.services.billingmanagement.model.*;
import com.hms.services.billingmanagement.repository.PathologyBillRepository;
import com.hms.services.billingmanagement.repository.PathologyRepository;
import com.hms.services.billingmanagement.repository.PathologyTestParameterRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PathologyBillService {

    private final PathologyBillRepository billRepository;
    private final PathologyRepository testRepository;
    private final ObjectMapper objectMapper;
    private final LaboratoryManagementInterface laboratoryManagementInterface;
    private final PathologyTestParameterRepository testParameterRepository;
    private final PatientManagementInterface patientManagementInterface;
    private final ModelMapper modelMapper;
    private final IpdInterface ipdInterface;
    private final OpdInterface opdInterface;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public PathologyBillService(PathologyBillRepository billRepository, PathologyRepository testRepository, ObjectMapper objectMapper, LaboratoryManagementInterface laboratoryManagementInterface, PathologyTestParameterRepository testParameterRepository, PatientManagementInterface patientManagementInterface, ModelMapper modelMapper, IpdInterface ipdInterface, OpdInterface opdInterface, KafkaTemplate<String, String> kafkaTemplate) {
        this.billRepository = billRepository;
        this.testRepository = testRepository;
        this.objectMapper = objectMapper;
        this.laboratoryManagementInterface = laboratoryManagementInterface;
        this.testParameterRepository = testParameterRepository;
        this.patientManagementInterface = patientManagementInterface;
        this.modelMapper = modelMapper;
        this.ipdInterface = ipdInterface;
        this.opdInterface = opdInterface;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public PathologyBillDTO generateBill(
            String billDataJson,
            MultipartFile photoFile) {

        try {
            PathologyBillDTO billDTO = objectMapper.readValue(billDataJson, PathologyBillDTO.class);
            HMS_TM_PathologyBill bill = new HMS_TM_PathologyBill();

            String maxId = billRepository.findMaxBillId();

            int nextId = (maxId == null) ? 1 : Integer.parseInt(maxId.substring(5)) + 1;
            String generatedId = "PATHO" + String.format("%03d", nextId);

            bill.setBillId(generatedId);
            bill.setHospitalDoctor(billDTO.getHospitalDoctor());
            bill.setBillNo(billDTO.getBillNo());
            bill.setCaseId(billDTO.getCaseId());
            bill.setPrescriptionNo(billDTO.getPrescriptionNo());
            bill.setPatientId(billDTO.getPatientId());
            bill.setDoctorName(billDTO.getDoctorName());
            bill.setNote(billDTO.getNote());
            bill.setPreviousReportValue(billDTO.getPreviousReportValue());
            bill.setTotalAmount(billDTO.getTotalAmount());
            bill.setDiscount(billDTO.getDiscount());
            bill.setTax(billDTO.getTax());
            bill.setNetAmount(billDTO.getNetAmount());
            bill.setPaymentMode(billDTO.getPaymentMode());
            bill.setPaymentAmount(billDTO.getPaymentAmount());
            bill.setDateTime(LocalDateTime.now());
            bill.setChequeDate(billDTO.getChequeDate());
            bill.setChequeNo(billDTO.getChequeNo());
            bill.setAttachDocument(billDTO.getAttachDocument());
            bill.setIpdOrOpdId(billDTO.getIpdOrOpdId());

            double netAmount = billDTO.getNetAmount() != null ? billDTO.getNetAmount() : 0.0;
            double paymentAmount = billDTO.getPaymentAmount() != null ? billDTO.getPaymentAmount() : 0.0;
            double balanceAmount = netAmount - paymentAmount;
            bill.setBalanceAmount(balanceAmount > 0 ? balanceAmount : 0.0);

            if (photoFile != null) {
                byte[] photoBytes = photoFile.getBytes();
                String encodedPhoto = Base64.getEncoder().encodeToString(photoBytes);
                bill.setAttachDocument(encodedPhoto);
            }
            if(billDTO.getPrescriptionNo().startsWith("OPD")){
                opdInterface.addPrescriptionByPayment(billDTO.getPrescriptionNo(),null,true,null);
            } else if (billDTO.getPrescriptionNo().startsWith("IPD")) {
                ipdInterface.addPrescriptionByPayment(billDTO.getPrescriptionNo(),null,true,null);
            }
            HMS_TM_PathologyBill savedBill = billRepository.save(bill);
            String billId = savedBill.getBillId();

            List<HMS_TM_PathologyTest> tests = null;
            if (billDTO.getPathologyItems() != null && !billDTO.getPathologyItems().isEmpty()) {
                tests = billDTO.getPathologyItems().stream()
                        .map(testDTO -> {
                            HMS_TM_PathologyTest test = new HMS_TM_PathologyTest();
                            test.setReportDays(testDTO.getReportDays());
                            test.setReportDate(testDTO.getReportDate());
                            test.setTax(testDTO.getTax());
                            test.setPrescriptionNo(testDTO.getPrescriptionNo());
                            test.setAmount(testDTO.getAmount());
                            test.setBillId(billId);
                            test.setPathologyCenter(testDTO.getPathologyCenter());
                            test.setPathologyTestId(testDTO.getPathologyTestId());
                            test.setSampleCollected(testDTO.getSampleCollected());
                            test.setCollectedDate(testDTO.getCollectedDate());
                            test.setApprovedBy(testDTO.getApprovedBy());
                            test.setApprovedDate(testDTO.getApprovedDate());
                            return test;
                        })
                        .collect(Collectors.toList());

                testRepository.saveAll(tests);
            }

            PathologyBillDTO responseDTO = new PathologyBillDTO();
            responseDTO.setBillId(savedBill.getBillId());
            responseDTO.setCaseId(savedBill.getCaseId());
            responseDTO.setPatientId(savedBill.getPatientId());
            responseDTO.setPrescriptionNo(savedBill.getPrescriptionNo());
            responseDTO.setBillNo(savedBill.getBillNo());
            responseDTO.setHospitalDoctor(savedBill.getHospitalDoctor());
            responseDTO.setDoctorName(savedBill.getDoctorName());
            responseDTO.setNote(savedBill.getNote());
            responseDTO.setPreviousReportValue(savedBill.getPreviousReportValue());
            responseDTO.setTotalAmount(savedBill.getTotalAmount());
            responseDTO.setDiscount(savedBill.getDiscount());
            responseDTO.setTax(savedBill.getTax());
            responseDTO.setNetAmount(savedBill.getNetAmount());
            responseDTO.setPaymentMode(savedBill.getPaymentMode());
            responseDTO.setPaymentAmount(savedBill.getPaymentAmount());
            responseDTO.setDateTime(savedBill.getDateTime());
            responseDTO.setBalanceAmount(savedBill.getBalanceAmount());
            responseDTO.setAttachDocument(savedBill.getAttachDocument());
            responseDTO.setChequeNo(savedBill.getChequeNo());
            responseDTO.setChequeDate(savedBill.getChequeDate());
            responseDTO.setIpdOrOpdId(savedBill.getIpdOrOpdId());

            if (tests != null) {
                List<PathologyDTO> testDTOs = tests.stream()
                        .map(test -> {
                            PathologyDTO testDTO = new PathologyDTO();
                            testDTO.setTestId(test.getTestId());
                            testDTO.setBillId(test.getBillId());
                            testDTO.setPathologyTestId(test.getPathologyTestId());
                            testDTO.setReportDays(test.getReportDays());
                            testDTO.setReportDate(test.getReportDate());
                            testDTO.setPrescriptionNo(test.getPrescriptionNo());
                            testDTO.setTax(test.getTax());
                            testDTO.setAmount(test.getAmount());
                            testDTO.setPathologyCenter(test.getPathologyCenter());
                            testDTO.setSampleCollected(test.getSampleCollected());
                            testDTO.setCollectedDate(test.getCollectedDate());
                            testDTO.setApprovedBy(test.getApprovedBy());
                            testDTO.setApprovedDate(test.getApprovedDate());
                            return testDTO;
                        })
                        .collect(Collectors.toList());
                responseDTO.setPathologyItems(testDTOs);
            }

            return responseDTO;

        } catch (Exception e) {
            throw new RuntimeException("Error generating pathology bill: " + e.getMessage(), e);
        }
    }

//    @Transactional
//    public List<PathologyBillDTO> getAllBills() {
//        List<HMS_TM_PathologyBill> bills = billRepository.findAllByDeletedFalse();
//
//        return bills.stream().map(bill -> {
//            PathologyBillDTO dto = new PathologyBillDTO();
//            dto.setBillId(bill.getBillId());
//            dto.setCaseId(bill.getCaseId());
//
//            ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(bill.getPatientId());
//            PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
//            dto.setPatientId(patientDetails.getPatientId());
//            dto.setPatientDetails(patientDetails);
//
//            dto.setPrescriptionNo(bill.getPrescriptionNo());
//            dto.setDateTime(bill.getDateTime());
//            dto.setBillNo(bill.getBillNo());
//            dto.setHospitalDoctor(bill.getHospitalDoctor());
//            dto.setDoctorName(bill.getDoctorName());
//            dto.setNote(bill.getNote());
//            dto.setPreviousReportValue(bill.getPreviousReportValue());
//            dto.setTotalAmount(bill.getTotalAmount());
//            dto.setDiscount(bill.getDiscount());
//            dto.setTax(bill.getTax());
//            dto.setNetAmount(bill.getNetAmount());
//            dto.setPaymentMode(bill.getPaymentMode());
//            dto.setPaymentAmount(bill.getPaymentAmount());
//            dto.setBalanceAmount(bill.getBalanceAmount());
//            dto.setAttachDocument(bill.getAttachDocument());
//            dto.setChequeDate(bill.getChequeDate());
//            dto.setChequeNo(bill.getChequeNo());
//            dto.setIpdOrOpdId(bill.getIpdOrOpdId());
//
//            List<HMS_TM_PathologyTest> tests = testRepository.findByBillId(bill.getBillId());
//            List<PathologyDTO> testDTOs = tests.stream()
//                    .map(test -> {
//                        PathologyDTO testDTO = new PathologyDTO();
//                        testDTO.setTestId(test.getTestId());
//                        testDTO.setPathologyTestId(test.getPathologyTestId());
//                        testDTO.setBillId(test.getBillId());
//                        testDTO.setReportDays(test.getReportDays());
//                        testDTO.setPrescriptionNo(test.getPrescriptionNo());
//                        testDTO.setReportDate(test.getReportDate());
//                        testDTO.setTax(test.getTax());
//                        testDTO.setAmount(test.getAmount());
//                        testDTO.setSampleCollected(test.getSampleCollected());
//                        testDTO.setCollectedDate(test.getCollectedDate());
//                        testDTO.setPathologyCenter(test.getPathologyCenter());
//                        testDTO.setApprovedBy(test.getApprovedBy());
//                        testDTO.setApprovedDate(test.getApprovedDate());
//                        testDTO.setUploadReport(test.getUploadReport());
//                        testDTO.setResult(test.getResult());
//
//                        ResponseEntity<PathologyTestDetailsDTO> labTestResponse = laboratoryManagementInterface.getLabTestById(test.getPathologyTestId());
//                        PathologyTestDetailsDTO testDetails = labTestResponse.getBody();
//                        testDTO.setPathologyTestId(testDetails.getPathologyTestId());
//                        testDTO.setPathologyDetails(testDetails);
//                        return testDTO;
//
//                    })
//                    .collect(Collectors.toList());
//
//            dto.setPathologyItems(testDTOs);
//            return dto;
//        }).collect(Collectors.toList());
//    }

    @Transactional
    public List<PathologyBillDTO> getAllBills(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.asc("dateTime")));
            Page<HMS_TM_PathologyBill> billsPage = billRepository.findAllByDeletedFalse(pageRequest);
            List<HMS_TM_PathologyBill> bills = billsPage.getContent();

            return bills.stream().map(bill -> {
                PathologyBillDTO dto = new PathologyBillDTO();
                dto.setBillId(bill.getBillId());
                dto.setCaseId(bill.getCaseId());

                ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(bill.getPatientId());
                PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
                dto.setPatientId(patientDetails.getPatientId());
                dto.setPatientDetails(patientDetails);

                dto.setPrescriptionNo(bill.getPrescriptionNo());
                dto.setDateTime(bill.getDateTime());
                dto.setBillNo(bill.getBillNo());
                dto.setHospitalDoctor(bill.getHospitalDoctor());
                dto.setDoctorName(bill.getDoctorName());
                dto.setNote(bill.getNote());
                dto.setPreviousReportValue(bill.getPreviousReportValue());
                dto.setTotalAmount(bill.getTotalAmount());
                dto.setDiscount(bill.getDiscount());
                dto.setTax(bill.getTax());
                dto.setNetAmount(bill.getNetAmount());
                dto.setPaymentMode(bill.getPaymentMode());
                dto.setPaymentAmount(bill.getPaymentAmount());
                dto.setBalanceAmount(bill.getBalanceAmount());
                dto.setAttachDocument(bill.getAttachDocument());
                dto.setChequeDate(bill.getChequeDate());
                dto.setChequeNo(bill.getChequeNo());
                dto.setIpdOrOpdId(bill.getIpdOrOpdId());

                List<HMS_TM_PathologyTest> tests = testRepository.findByBillId(bill.getBillId());
                List<PathologyDTO> testDTOs = tests.stream().map(test -> {
                    PathologyDTO testDTO = new PathologyDTO();
                    testDTO.setTestId(test.getTestId());
                    testDTO.setPathologyTestId(test.getPathologyTestId());
                    testDTO.setBillId(test.getBillId());
                    testDTO.setReportDays(test.getReportDays());
                    testDTO.setPrescriptionNo(test.getPrescriptionNo());
                    testDTO.setReportDate(test.getReportDate());
                    testDTO.setTax(test.getTax());
                    testDTO.setAmount(test.getAmount());
                    testDTO.setSampleCollected(test.getSampleCollected());
                    testDTO.setCollectedDate(test.getCollectedDate());
                    testDTO.setPathologyCenter(test.getPathologyCenter());
                    testDTO.setApprovedBy(test.getApprovedBy());
                    testDTO.setApprovedDate(test.getApprovedDate());
                    testDTO.setUploadReport(test.getUploadReport());
                    testDTO.setResult(test.getResult());

                    ResponseEntity<PathologyTestDetailsDTO> labTestResponse = laboratoryManagementInterface.getLabTestById(test.getPathologyTestId());
                    PathologyTestDetailsDTO testDetails = labTestResponse.getBody();
                    testDTO.setPathologyTestId(testDetails.getPathologyTestId());
                    testDTO.setPathologyDetails(testDetails);
                    return testDTO;
                }).collect(Collectors.toList());

                dto.setPathologyItems(testDTOs);
                return dto;
            }).collect(Collectors.toList());
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    public PathologyBillDTO getBillById(String billId) {
        HMS_TM_PathologyBill bill = billRepository.findByBillIdAndDeletedFalse(billId)
                .orElseThrow(() -> new RuntimeException("Pathology bill not found with ID: " + billId));

        PathologyBillDTO dto = new PathologyBillDTO();

        dto.setBillId(bill.getBillId());
        dto.setHospitalDoctor(bill.getHospitalDoctor());
        dto.setCaseId(bill.getCaseId());

        ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(bill.getPatientId());
        PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
        dto.setPatientId(patientDetails.getPatientId());
        dto.setPatientDetails(patientDetails);

        dto.setPrescriptionNo(bill.getPrescriptionNo());
        dto.setDateTime(bill.getDateTime());
        dto.setBillNo(bill.getBillNo());
        dto.setPreviousReportValue(bill.getPreviousReportValue());
        dto.setDoctorName(bill.getDoctorName());
        dto.setNote(bill.getNote());
        dto.setTotalAmount(bill.getTotalAmount());
        dto.setDiscount(bill.getDiscount());
        dto.setTax(bill.getTax());
        dto.setNetAmount(bill.getNetAmount());
        dto.setPaymentMode(bill.getPaymentMode());
        dto.setPaymentAmount(bill.getPaymentAmount());
        dto.setBalanceAmount(bill.getBalanceAmount());
        dto.setAttachDocument(bill.getAttachDocument());
        dto.setChequeDate(bill.getChequeDate());
        dto.setChequeNo(bill.getChequeNo());
        dto.setIpdOrOpdId(bill.getIpdOrOpdId());

        List<HMS_TM_PathologyTest> tests = testRepository.findByBillId(bill.getBillId());
        List<PathologyDTO> testDTOs = tests.stream()
                .map(test -> {
                    PathologyDTO testDTO = new PathologyDTO();
                    testDTO.setTestId(test.getTestId());
                    testDTO.setBillId(test.getBillId());
                    testDTO.setPathologyTestId(test.getPathologyTestId());
                    testDTO.setReportDays(test.getReportDays());
                    testDTO.setPrescriptionNo(test.getPrescriptionNo());
                    testDTO.setReportDate(test.getReportDate());
                    testDTO.setTax(test.getTax());
                    testDTO.setAmount(test.getAmount());
                    testDTO.setSampleCollected(test.getSampleCollected());
                    testDTO.setCollectedDate(test.getCollectedDate());
                    testDTO.setPathologyCenter(test.getPathologyCenter());
                    testDTO.setApprovedBy(test.getApprovedBy());
                    testDTO.setApprovedDate(test.getApprovedDate());
                    testDTO.setUploadReport(test.getUploadReport());
                    testDTO.setResult(test.getResult());

                    ResponseEntity<PathologyTestDetailsDTO> labTestResponse = laboratoryManagementInterface.getLabTestById(test.getPathologyTestId());
                    PathologyTestDetailsDTO testDetails = labTestResponse.getBody();
                    testDTO.setPathologyTestId(testDetails.getPathologyTestId());
                    testDTO.setPathologyDetails(testDetails);

                    return testDTO;
                })
                .collect(Collectors.toList());

        dto.setPathologyItems(testDTOs);

        return dto;
    }

    @Transactional
    public PathologyBillDTO getBillByTestId(String testId) {
        HMS_TM_PathologyTest test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Pathology test not found with ID: " + testId));

        HMS_TM_PathologyBill bill = billRepository.findByBillIdAndDeletedFalse(test.getBillId())
                .orElseThrow(() -> new RuntimeException("Pathology bill not found with ID: " + test.getBillId()));

        PathologyBillDTO dto = new PathologyBillDTO();
        dto.setBillId(bill.getBillId());
        dto.setHospitalDoctor(bill.getHospitalDoctor());
        dto.setCaseId(bill.getCaseId());
        dto.setPatientId(bill.getPatientId());
        dto.setPrescriptionNo(bill.getPrescriptionNo());
        dto.setDateTime(bill.getDateTime());
        dto.setBillNo(bill.getBillNo());
        dto.setPreviousReportValue(bill.getPreviousReportValue());
        dto.setDoctorName(bill.getDoctorName());
        dto.setNote(bill.getNote());
        dto.setTotalAmount(bill.getTotalAmount());
        dto.setDiscount(bill.getDiscount());
        dto.setTax(bill.getTax());
        dto.setNetAmount(bill.getNetAmount());
        dto.setPaymentMode(bill.getPaymentMode());
        dto.setPaymentAmount(bill.getPaymentAmount());
        dto.setBalanceAmount(bill.getBalanceAmount());
        dto.setAttachDocument(bill.getAttachDocument());
        dto.setChequeDate(bill.getChequeDate());
        dto.setChequeNo(bill.getChequeNo());
        dto.setIpdOrOpdId(bill.getIpdOrOpdId());

        List<HMS_TM_PathologyTest> tests = List.of(test);
        List<PathologyDTO> testDTOs = tests.stream()
                .map(t -> {
                    PathologyDTO testDTO = new PathologyDTO();
                    testDTO.setTestId(t.getTestId());
                    testDTO.setBillId(t.getBillId());
                    testDTO.setPathologyTestId(t.getPathologyTestId());
                    testDTO.setReportDays(t.getReportDays());
                    testDTO.setPrescriptionNo(t.getPrescriptionNo());
                    testDTO.setReportDate(t.getReportDate());
                    testDTO.setTax(t.getTax());
                    testDTO.setAmount(t.getAmount());
                    testDTO.setSampleCollected(t.getSampleCollected());
                    testDTO.setCollectedDate(t.getCollectedDate());
                    testDTO.setPathologyCenter(t.getPathologyCenter());
                    testDTO.setApprovedBy(t.getApprovedBy());
                    testDTO.setApprovedDate(t.getApprovedDate());
                    testDTO.setUploadReport(t.getUploadReport());
                    testDTO.setResult(t.getResult());

                    ResponseEntity<PathologyTestDetailsDTO> labTestResponse =
                            laboratoryManagementInterface.getLabTestById(t.getPathologyTestId());

                    if (labTestResponse != null && labTestResponse.getStatusCode().is2xxSuccessful()) {
                        PathologyTestDetailsDTO testDetails = labTestResponse.getBody();

                        PathologyTestDetailsDTO limitedDetails = new PathologyTestDetailsDTO();
                        limitedDetails.setPathologyTestId(testDetails.getPathologyTestId());
                        limitedDetails.setTestName(testDetails.getTestName());

                        List<HMS_TM_Pathology_Parameters> parameters =
                                testParameterRepository.findByTestId(t.getTestId());

                        List<PathologyTestParameterDTO> mergedParameters = testDetails.getTestParameters().stream()
                                .map(p -> {
                                    PathologyTestParameterDTO param = new PathologyTestParameterDTO();
                                    param.setParameterId(p.getParameterId());
                                    param.setPathologyTestId(p.getPathologyTestId());
                                    param.setParameterName(p.getParameterName());
                                    param.setNormalRange(p.getNormalRange());
                                    param.setUnit(p.getUnit());

                                    parameters.stream()
                                            .filter(dbParam -> dbParam.getTestId().equals(t.getTestId()) && dbParam.getParameterName().equalsIgnoreCase(p.getParameterName()))
                                            .forEach(dbParam -> {
                                                param.setReportValue(dbParam.getReportValue() != null ? dbParam.getReportValue() : null);
                                            });

                                    return param;

                                })
                                .collect(Collectors.toList());

                        limitedDetails.setTestParameters(mergedParameters);

                        testDTO.setPathologyTestDetails(limitedDetails);
                    }

                    return testDTO;
                })
                .collect(Collectors.toList());

        dto.setPathologyItems(testDTOs);

        return dto;
    }

    public HMS_TM_PathologyTest updateTestDetailsByTestId(
            String testId,
            PathologyTestUpdateRequest updateRequest,
            MultipartFile uploadReportFile) {

        HMS_TM_PathologyTest test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));

        test.setApprovedBy(updateRequest.getApprovedBy());
        test.setApprovedDate(updateRequest.getApprovedDate());
        test.setResult(updateRequest.getResult());

        if (uploadReportFile != null) {
            try {
                byte[] fileBytes = uploadReportFile.getBytes();
                String encodedFile = Base64.getEncoder().encodeToString(fileBytes);
                test.setUploadReport(encodedFile);
            } catch (IOException e) {
                throw new RuntimeException("Error while encoding the file: " + e.getMessage());
            }
        }

        testRepository.save(test);
        saveTestParameters(testId, updateRequest.getParameters());
        sendNotification(test.getPrescriptionNo(),updateRequest.getApprovedBy());
        return test;
    }

    private void sendNotification(String prescriptionNo,String approvedBy) {
        Map<String, String> event = new HashMap<>();
        if(prescriptionNo.startsWith("OPD")){
            List<OPDPrescriptionsDTO> opd=opdInterface.getPrescriptionByPrescriptionNo(prescriptionNo).getBody();
            event.put("doctorId", opd.get(0).getDoctorId());
            event.put("ipdOrOpdId", opd.get(0).getOpdId());
        } else if (prescriptionNo.startsWith("IPD")) {
            List<PrescriptionDTO> ipd=ipdInterface.getPrescriptionByPrescriptionNo(prescriptionNo).getBody();
            event.put("doctorId", ipd.get(0).getDoctorId());
            event.put("ipdOrOpdId", ipd.get(0).getIpdId());
        }
        event.put("prescriptionNo", prescriptionNo);
        event.put("title", "Pathology Report");
        event.put("message", "The patient's pathology report (Prescription No: " + prescriptionNo + ") has been generated and approved bym ["+approvedBy+"]");
        try {
            String eventMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send("pathology-labreport-completed", eventMessage);
            System.out.println("Published Event: " + eventMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void saveTestParameters(String testId, List<PathologyTestParameterDTO> parameters) {
        for (PathologyTestParameterDTO parameterDTO : parameters) {
            HMS_TM_Pathology_Parameters parameter = new HMS_TM_Pathology_Parameters();
            parameter.setTestId(testId);
            parameter.setParameterName(parameterDTO.getParameterName());
            parameter.setNormalRange(parameterDTO.getNormalRange());
            parameter.setReportValue(parameterDTO.getReportValue());
            parameter.setUnit(parameterDTO.getUnit());

            testParameterRepository.save(parameter);
        }
    }

    public HMS_TM_PathologyTest updatePathologyTest(String testId, PathologyBillUpdateDTO updateDTO) {
        HMS_TM_PathologyTest test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));

        test.setSampleCollected(updateDTO.getSampleCollected());
        test.setCollectedDate(updateDTO.getCollectedDate());
        test.setPathologyCenter(updateDTO.getPathologyCenter());

        return testRepository.save(test);
    }

    @Transactional
    public PathologyBillDTO updatePathologyBill(
            String billId,
            String pathologyDataJson,
            MultipartFile photoFile) {

        try {
            PathologyBillDTO billDTO = objectMapper.readValue(pathologyDataJson, PathologyBillDTO.class);

            HMS_TM_PathologyBill pathologyBill = billRepository.findById(billId)
                    .orElseThrow(() -> new RuntimeException("Pathology bill not found with ID: " + billId));

            pathologyBill.setHospitalDoctor(billDTO.getHospitalDoctor());
            pathologyBill.setBillNo(billDTO.getBillNo());
            pathologyBill.setCaseId(billDTO.getCaseId());
            pathologyBill.setPatientId(billDTO.getPatientId());
            pathologyBill.setPrescriptionNo(billDTO.getPrescriptionNo());
            pathologyBill.setDoctorName(billDTO.getDoctorName());
            pathologyBill.setDateTime(LocalDateTime.now());
            pathologyBill.setNote(billDTO.getNote());
            pathologyBill.setPreviousReportValue(billDTO.getPreviousReportValue());
            pathologyBill.setTotalAmount(billDTO.getTotalAmount());
            pathologyBill.setDiscount(billDTO.getDiscount());
            pathologyBill.setTax(billDTO.getTax());
            pathologyBill.setNetAmount(billDTO.getNetAmount());
            pathologyBill.setPaymentMode(billDTO.getPaymentMode());
            pathologyBill.setChequeNo(billDTO.getChequeNo());
            pathologyBill.setChequeDate(billDTO.getChequeDate());
            pathologyBill.setIpdOrOpdId(billDTO.getIpdOrOpdId());

            Double previousPaymentAmount = pathologyBill.getPaymentAmount() != null ? pathologyBill.getPaymentAmount() : 0.0;
            Double balanceAmount = pathologyBill.getNetAmount() - previousPaymentAmount;

            Double newPayment = billDTO.getPaymentAmount();
            if (newPayment != null && newPayment > 0) {
                pathologyBill.setPaymentAmount(previousPaymentAmount + newPayment);
                balanceAmount -= newPayment;
            }

            pathologyBill.setBalanceAmount(balanceAmount > 0 ? balanceAmount : 0.0);

            if (photoFile != null) {
                byte[] photoBytes = photoFile.getBytes();
                String encodedPhoto = Base64.getEncoder().encodeToString(photoBytes);
                pathologyBill.setAttachDocument(encodedPhoto);
            }

            List<PathologyDTO> pathologyDTOList = new ArrayList<>();
            if (billDTO.getPathologyItems() != null) {
                for (PathologyDTO pathologyDTO : billDTO.getPathologyItems()) {
                    HMS_TM_PathologyTest pathologyTest;

                    if (pathologyDTO.getTestId() != null) {
                        pathologyTest = testRepository.findById(pathologyDTO.getTestId())
                                .orElseThrow(() -> new RuntimeException("Pathology test not found with ID: " + pathologyDTO.getTestId()));
                    } else {
                        pathologyTest = new HMS_TM_PathologyTest();
                    }

                    pathologyTest.setTestId(pathologyDTO.getTestId());
                    pathologyTest.setPathologyTestId(pathologyDTO.getPathologyTestId());
                    pathologyTest.setReportDays(pathologyDTO.getReportDays());
                    pathologyTest.setReportDate(pathologyDTO.getReportDate());
                    pathologyBill.setPrescriptionNo(pathologyDTO.getPrescriptionNo());
                    pathologyTest.setTax(pathologyDTO.getTax());
                    pathologyTest.setAmount(pathologyDTO.getAmount());

                    pathologyTest.setBillId(pathologyBill.getBillId());

                    pathologyTest = testRepository.save(pathologyTest);

                    PathologyDTO savedPathologyDTO = new PathologyDTO();
                    savedPathologyDTO.setTestId(pathologyTest.getTestId());
                    savedPathologyDTO.setPathologyTestId(pathologyTest.getPathologyTestId());
                    savedPathologyDTO.setReportDays(pathologyTest.getReportDays());
                    savedPathologyDTO.setReportDate(pathologyTest.getReportDate());
                    savedPathologyDTO.setTax(pathologyTest.getTax());
                    savedPathologyDTO.setAmount(pathologyTest.getAmount());

                    pathologyDTOList.add(savedPathologyDTO);
                }
            }

            billRepository.save(pathologyBill);

            PathologyBillDTO responseDTO = new PathologyBillDTO();
            responseDTO.setBillId(pathologyBill.getBillId());
            responseDTO.setBillNo(pathologyBill.getBillNo());
            responseDTO.setCaseId(pathologyBill.getCaseId());
            responseDTO.setPatientId(pathologyBill.getPatientId());
            responseDTO.setPrescriptionNo(pathologyBill.getPrescriptionNo());
            responseDTO.setDateTime(pathologyBill.getDateTime());
            responseDTO.setHospitalDoctor(pathologyBill.getHospitalDoctor());
            responseDTO.setDoctorName(pathologyBill.getDoctorName());
            responseDTO.setNote(pathologyBill.getNote());
            responseDTO.setPreviousReportValue(pathologyBill.getPreviousReportValue());
            responseDTO.setTotalAmount(pathologyBill.getTotalAmount());
            responseDTO.setDiscount(pathologyBill.getDiscount());
            responseDTO.setTax(pathologyBill.getTax());
            responseDTO.setNetAmount(pathologyBill.getNetAmount());
            responseDTO.setPaymentMode(pathologyBill.getPaymentMode());
            responseDTO.setPaymentAmount(pathologyBill.getPaymentAmount());
            responseDTO.setBalanceAmount(pathologyBill.getBalanceAmount());
            responseDTO.setChequeDate(pathologyBill.getChequeDate());
            responseDTO.setChequeNo(pathologyBill.getChequeNo());
            responseDTO.setAttachDocument(pathologyBill.getAttachDocument());
            responseDTO.setIpdOrOpdId(pathologyBill.getIpdOrOpdId());
            responseDTO.setPathologyItems(pathologyDTOList);

            return responseDTO;

        } catch (Exception e) {
            throw new RuntimeException("Error updating pathology bill: " + e.getMessage(), e);
        }
    }

    public void deletePathologyBill(String billId) {
        Optional<HMS_TM_PathologyBill> billOptional = billRepository.findById(billId);
        if (billOptional.isPresent()) {
            HMS_TM_PathologyBill bill = billOptional.get();
            bill.setDeleted(true);
            billRepository.save(bill);
        } else {
            throw new RuntimeException("Pathology Bill not found with ID: " + billId);
        }
    }

    public IncomeChanges getPathologyIncome() {
        Double todayIncome = billRepository.getTotalPathologyIncome();
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Double yesterdayIncome = billRepository.getYesterdayPathologyIncome(yesterday);
        todayIncome = (todayIncome != null) ? todayIncome : 0.0;
        yesterdayIncome = (yesterdayIncome != null) ? yesterdayIncome : 0.0;
        String percentageChange;
        if (yesterdayIncome == 0.0) {
            percentageChange = (todayIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((todayIncome - yesterdayIncome) / yesterdayIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(todayIncome, percentageChange);
    }

    public Double getPathologyMonthlyIncome() {
        Double monthlyIncome = billRepository.getMonthlyTotalPathologyIncome();
        return (monthlyIncome != null) ? monthlyIncome : 0.0;
    }
    @Transactional
    public List<PathologyTestDTO> getPathologyTestsByIds(List<String> ids,String prescriptionNo) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        List<String> billIds = billRepository.findAllBillIdsByPrescriptionNoAndDeletedFalse(prescriptionNo);
        if(billIds!=null && !billIds.isEmpty()) {
            List<HMS_TM_PathologyTest> tests = testRepository.findAllByBillIdIn(billIds);
            return tests.stream().map(test -> {
                PathologyTestDTO dto = new PathologyTestDTO();
                ResponseEntity<PathologyTestDetailsDTO> labTestResponse =
                        laboratoryManagementInterface.getLabTestById(test.getPathologyTestId());
                dto.setTestName(labTestResponse.getBody().getTestName());
                dto.setPathologyTestId(test.getPathologyTestId());
                dto.setTestId(test.getTestId());
                dto.setReportDays(test.getReportDays());
                dto.setReportDate(test.getReportDate());
                dto.setTax(test.getTax());
                dto.setAmount(test.getAmount());
                dto.setSampleCollected(test.getSampleCollected());
                dto.setApprovedBy(test.getApprovedBy());
                dto.setCollectedDate(test.getCollectedDate());
                dto.setPathologyCenter(test.getPathologyCenter());
                dto.setApprovedDate(test.getApprovedDate());
                dto.setUploadReport(test.getUploadReport());
                dto.setResult(test.getResult());
                dto.setBillId(test.getBillId());

                List<PathologyTestParameterDTO> responseParameters = testParameterRepository
                        .findByTestId(test.getTestId()).stream()
                        .map(param -> {
                            PathologyTestParameterDTO responseParam = new PathologyTestParameterDTO();
                            responseParam.setParameterName(param.getParameterName());
                            responseParam.setParameterId(param.getParameterId());
                            responseParam.setPathologyTestId(param.getTestId());
                            responseParam.setNormalRange(param.getNormalRange());
                            responseParam.setReportValue(param.getReportValue());
                            responseParam.setUnit(param.getUnit());
                            return responseParam;
                        }).collect(Collectors.toList());

                dto.setTestParameters(responseParameters);
                return dto;
            }).collect(Collectors.toList());
        }else{
//            List<HMS_TM_PathologyTest> tests = testRepository.findByPathologyTestIdInAndCollectedDateIsNull(ids);
            // List<HMS_TM_PathologyTest> tests = testRepository.findByPathologyTestIdInAndPrescriptionNo(ids,prescriptionNo);
            List<HMS_TM_PathologyTest> tests = ids.stream()
                    .map(id -> {
                        HMS_TM_PathologyTest test = new HMS_TM_PathologyTest();
                        test.setPathologyTestId(id);
                        return test;
                    })
                    .collect(Collectors.toList());
            if (tests.isEmpty()) {
                return Collections.emptyList();
            }
            return tests.stream().map(test -> {
                PathologyTestDTO dto = new PathologyTestDTO();
                ResponseEntity<PathologyTestDetailsDTO> labTestResponse =
                        laboratoryManagementInterface.getLabTestById(test.getPathologyTestId());
                dto.setTestName(labTestResponse.getBody().getTestName());
                dto.setPathologyTestId(test.getPathologyTestId());
                dto.setTestId(test.getTestId());
                dto.setReportDays(test.getReportDays());
                dto.setReportDate(test.getReportDate());
                dto.setTax(test.getTax());
                dto.setAmount(test.getAmount());
                dto.setSampleCollected(test.getSampleCollected());
                dto.setApprovedBy(test.getApprovedBy());
                dto.setCollectedDate(test.getCollectedDate());
                dto.setPathologyCenter(test.getPathologyCenter());
                dto.setApprovedDate(test.getApprovedDate());
                dto.setUploadReport(test.getUploadReport());
                dto.setResult(test.getResult());
                dto.setBillId(test.getBillId());

                List<PathologyTestParameterDTO> responseParameters = testParameterRepository
                        .findByTestId(test.getTestId()).stream()
                        .map(param -> {
                            PathologyTestParameterDTO responseParam = new PathologyTestParameterDTO();
                            responseParam.setParameterName(param.getParameterName());
                            responseParam.setParameterId(param.getParameterId());
                            responseParam.setPathologyTestId(param.getTestId());
                            responseParam.setNormalRange(param.getNormalRange());
                            responseParam.setReportValue(param.getReportValue());
                            responseParam.setUnit(param.getUnit());
                            return responseParam;
                        }).collect(Collectors.toList());

                dto.setTestParameters(responseParameters);
                return dto;
            }).collect(Collectors.toList());

        }

    }

//    public List<PathologyTestDTO> getPathologyTestsByIds(List<String> ids, String id) {
//        Optional<String> optionalBillId = billRepository.findBillIdByIpdOrOpdId(id);
//        if (optionalBillId.isEmpty()) {
////            throw new CustomException("No pathology tests found for the provided IDs: " + ids);
//            return Collections.emptyList();
//        }
//        // List<HMS_TM_PathologyTest> tests = testRepository.findByPathologyTestIdIn(ids);
//        List<HMS_TM_PathologyTest> tests = testRepository.findAllByBillId(optionalBillId);
//
//        return tests.stream().map(test -> {
//            PathologyTestDTO dto = new PathologyTestDTO();
//            ResponseEntity<PathologyTestDetailsDTO> labTestResponse =
//                    laboratoryManagementInterface.getLabTestById(test.getPathologyTestId());
//            dto.setTestName(labTestResponse.getBody().getTestName());
//            dto.setPathologyTestId(test.getPathologyTestId());
//            dto.setTestId(test.getTestId());
//            dto.setReportDays(test.getReportDays());
//            dto.setReportDate(test.getReportDate());
//            dto.setTax(test.getTax());
//            dto.setAmount(test.getAmount());
//            dto.setSampleCollected(test.getSampleCollected());
//            dto.setApprovedBy(test.getApprovedBy());
//            dto.setCollectedDate(test.getCollectedDate());
//            dto.setPathologyCenter(test.getPathologyCenter());
//            dto.setApprovedDate(test.getApprovedDate());
//            dto.setUploadReport(test.getUploadReport());
//            dto.setResult(test.getResult());
//            dto.setBillId(test.getBillId());
//
//            List<PathologyTestParameterDTO> responseParameters = testParameterRepository
//                    .findByTestId(test.getTestId()).stream()
//                    .map(param -> {
//                        PathologyTestParameterDTO responseParam = new PathologyTestParameterDTO();
//                        responseParam.setParameterName(param.getParameterName());
//                        responseParam.setParameterId(param.getParameterId());
//                        responseParam.setPathologyTestId(param.getTestId());
//                        responseParam.setNormalRange(param.getNormalRange());
//                        responseParam.setReportValue(param.getReportValue());
//                        responseParam.setUnit(param.getUnit());
//                        return responseParam;
//                    }).collect(Collectors.toList());
//
//            dto.setTestParameters(responseParameters);
//            return dto;
//        }).collect(Collectors.toList());
//    }


    public BillSummary getPathologyOpdAndIpdPayment(String ipdOrOpdId) {
        return billRepository.findSummaryByIpdOrOpdId(ipdOrOpdId)
                .orElse(new BillSummary(ipdOrOpdId, 0.0, 0.0));
    }


    public Integer getMedicalHistoryPathology(String patientId) {
        Integer pathology= billRepository.countByPatientId(patientId);
        return (pathology != null) ? pathology : 0;
    }

    public IncomeChanges getPathologyIncreaseMonthlyIncome() {
        Double currentMonthIncome = billRepository.getTotalPathologyIncomeForMonth(LocalDate.now().getMonthValue(), LocalDate.now().getYear());
        LocalDate previousMonth = LocalDate.now().minusMonths(1);
        Double previousMonthIncome = billRepository.getTotalPathologyIncomeForMonth(previousMonth.getMonthValue(), previousMonth.getYear());
        currentMonthIncome = (currentMonthIncome != null) ? currentMonthIncome : 0.0;
        previousMonthIncome = (previousMonthIncome != null) ? previousMonthIncome : 0.0;
        String percentageChange;
        if (previousMonthIncome == 0.0) {
            percentageChange = (currentMonthIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentMonthIncome, percentageChange);
    }

    public IncomeChanges getPathologyIncreaseYearlyIncome() {
        int currentYear = LocalDate.now().getYear();
        int previousYear = currentYear - 1;
        Double currentYearIncome = billRepository.getTotalPathologyIncomeForYear(currentYear);
        Double previousYearIncome = billRepository.getTotalPathologyIncomeForYear(previousYear);
        currentYearIncome = (currentYearIncome != null) ? currentYearIncome : 0.0;
        previousYearIncome = (previousYearIncome != null) ? previousYearIncome : 0.0;
        String percentageChange;
        if (previousYearIncome == 0.0) {
            percentageChange = (currentYearIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentYearIncome - previousYearIncome) / previousYearIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentYearIncome, percentageChange);
    }

    public IncomeChanges getPathologyIncreaseWeeklyIncome() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        LocalDate previousWeekDate = LocalDate.now().minusWeeks(1);
        int previousWeek = previousWeekDate.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int previousYear = previousWeekDate.getYear();
        Double currentWeekIncome = billRepository.getTotalPathologyIncomeForWeek(currentWeek, currentYear);
        Double previousWeekIncome = billRepository.getTotalPathologyIncomeForWeek(previousWeek, previousYear);
        currentWeekIncome = (currentWeekIncome != null) ? currentWeekIncome : 0.0;
        previousWeekIncome = (previousWeekIncome != null) ? previousWeekIncome : 0.0;
        String percentageChange;
        if (previousWeekIncome == 0.0) {
            percentageChange = (currentWeekIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentWeekIncome - previousWeekIncome) / previousWeekIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentWeekIncome, percentageChange);
    }


    @Transactional
    public List<HMS_TM_PathologyBill> getPathologyBillByIpdOrOpdId(String ipdOrOpdId) {
        return billRepository.findByIpdOrOpdIdAndDeletedFalse(ipdOrOpdId);
    }

    @Transactional
    public List<PathologyBillResponse> searchBills(
            String sampleCollector,
            String categoryName,
            String testName,
            String timeDuration,
            LocalDate startDate,
            LocalDate endDate) {

        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        List<HMS_TM_PathologyBill> bills = billRepository.findBillsWithFilters(
                sampleCollector,
                startDateTime,
                endDateTime
        );

        Set<PathologyBillResponse> responseSet = new HashSet<>();

        for (HMS_TM_PathologyBill bill : bills) {
            responseSet.addAll(convertToResponse(bill, categoryName, testName, sampleCollector));
        }

        return new ArrayList<>(responseSet);
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

    private List<PathologyBillResponse> convertToResponse(
            HMS_TM_PathologyBill bill,
            String categoryName,
            String testName,
            String sampleCollectedFilter) {

        List<PathologyBillResponse> responses = new ArrayList<>();

        PatientsDTO patient = patientManagementInterface.getPatientById(bill.getPatientId()).getBody();
        String patientName = patient != null ? patient.getFirstName() + " " + patient.getLastName() : "Unknown";

        List<HMS_TM_PathologyTest> tests = testRepository.findByBillId(bill.getBillId());
        Set<String> addedBills = new HashSet<>();

        for (HMS_TM_PathologyTest test : tests) {
            PathologyTestDetailsDTO testDetails = laboratoryManagementInterface.getLabTestById(test.getPathologyTestId()).getBody();

            if (testDetails != null) {
                boolean matchesCategory = categoryName == null || categoryName.equalsIgnoreCase(testDetails.getCategoryName());
                boolean matchesTestName = testName == null || testDetails.getTestName().equalsIgnoreCase(testName);
                boolean matchesSampleCollected = sampleCollectedFilter == null
                        || (test.getSampleCollected() != null && test.getSampleCollected().equalsIgnoreCase(sampleCollectedFilter));

                if (matchesCategory && matchesTestName && matchesSampleCollected) {
                    if (!addedBills.contains(bill.getBillNo())) {
                        PathologyBillResponse response = new PathologyBillResponse();
                        response.setBillNo(bill.getBillNo());
                        response.setDate(bill.getDateTime());
                        response.setPatientName(patientName);
                        response.setConsultantDoctor(bill.getDoctorName());
                        response.setSampleCollected(test.getSampleCollected());
                        response.setPreviousReportValue(bill.getPreviousReportValue());
                        response.setAmount(test.getAmount());
                        response.setCategoryName(testDetails.getCategoryName());
                        response.setTestName(testDetails.getTestName());

                        responses.add(response);
                        addedBills.add(bill.getBillNo());
                    }
                }
            }
        }
        return responses;
    }

    public List<HMS_TM_PathologyBill> fetchAllPathologyIncomeForToday() {
        return billRepository.getAllPathologyIncomeForToday();
    }

    public List<HMS_TM_PathologyBill> fetchAllPathologyIncomeForMonth() {
        int month = LocalDate.now().getMonthValue();
        int year = LocalDate.now().getYear();
        return billRepository.getAllPathologyIncomeForMonth(month, year);
    }

    public List<HMS_TM_PathologyBill> fetchAllPathologyIncomeForYear() {
        int year = LocalDate.now().getYear();
        return billRepository.getAllPathologyIncomeForYear(year);
    }


    public List<HMS_TM_PathologyBill> fetchAllPathologyIncomeForWeek() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        return billRepository.getAllPathologyIncomeForWeek(currentWeek, currentYear);
    }



}



