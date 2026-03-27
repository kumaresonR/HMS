package com.hms.services.billingmanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.billingmanagement.configuration.IpdInterface;
import com.hms.services.billingmanagement.configuration.LaboratoryManagementInterface;
import com.hms.services.billingmanagement.configuration.OpdInterface;
import com.hms.services.billingmanagement.configuration.PatientManagementInterface;
import com.hms.services.billingmanagement.entity.HMS_TM_PathologyTest;
import com.hms.services.billingmanagement.entity.HMS_TM_RadiologyBill;
import com.hms.services.billingmanagement.entity.HMS_TM_RadiologyTest;
import com.hms.services.billingmanagement.entity.HMS_TM_Radiology_Parameters;
import com.hms.services.billingmanagement.model.*;
import com.hms.services.billingmanagement.repository.RadiologyBillRepository;
import com.hms.services.billingmanagement.repository.RadiologyRepository;
import com.hms.services.billingmanagement.repository.RadiologyTestParameterRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
public class RadiologyBillService {

    private final RadiologyBillRepository billRepository;
    private final RadiologyRepository testRepository;
    private final ObjectMapper objectMapper;
    private final LaboratoryManagementInterface laboratoryManagementInterface;
    private final RadiologyTestParameterRepository testParameterRepository;
    private final PatientManagementInterface patientManagementInterface;
    private final ModelMapper modelMapper;
    private final IpdInterface ipdInterface;
    private final OpdInterface opdInterface;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public RadiologyBillService(RadiologyBillRepository billRepository, RadiologyRepository testRepository, ObjectMapper objectMapper, LaboratoryManagementInterface laboratoryManagementInterface, RadiologyTestParameterRepository testParameterRepository, PatientManagementInterface patientManagementInterface, ModelMapper modelMapper, IpdInterface ipdInterface, OpdInterface opdInterface, KafkaTemplate<String, String> kafkaTemplate) {
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
    public RadiologyBillDTO generateBill(
            String billDataJson,
            MultipartFile photoFile) {

        try {
            RadiologyBillDTO billDTO = objectMapper.readValue(billDataJson, RadiologyBillDTO.class);

            HMS_TM_RadiologyBill bill = new HMS_TM_RadiologyBill();

            String maxId = billRepository.findMaxBillId();

            int nextId = (maxId == null) ? 1 : Integer.parseInt(maxId.substring(5)) + 1;
            String generatedId = "RADIO" + String.format("%03d", nextId);

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
                opdInterface.addPrescriptionByPayment(billDTO.getPrescriptionNo(),null,null,true);
            } else if (billDTO.getPrescriptionNo().startsWith("IPD")) {
                ipdInterface.addPrescriptionByPayment(billDTO.getPrescriptionNo(),null,null,true);
            }
            HMS_TM_RadiologyBill savedBill = billRepository.save(bill);
            String billId = savedBill.getBillId();

            List<HMS_TM_RadiologyTest> tests = null;
            if (billDTO.getRadiologyItems() != null && !billDTO.getRadiologyItems().isEmpty()) {
                tests = billDTO.getRadiologyItems().stream()
                        .map(testDTO -> {
                            HMS_TM_RadiologyTest test = new HMS_TM_RadiologyTest();
                            test.setReportDays(testDTO.getReportDays());
                            test.setReportDate(testDTO.getReportDate());
                            test.setTax(testDTO.getTax());
                            test.setAmount(testDTO.getAmount());
                            test.setPrescriptionNo(testDTO.getPrescriptionNo());
                            test.setBillId(billId);
                            test.setRadiologyTestId(testDTO.getRadiologyTestId());
                            return test;
                        })
                        .collect(Collectors.toList());

                testRepository.saveAll(tests);
            }

            RadiologyBillDTO responseDTO = new RadiologyBillDTO();
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
                List<RadiologyDTO> testDTOs = tests.stream()
                        .map(test -> {
                            RadiologyDTO testDTO = new RadiologyDTO();
                            testDTO.setTestId(test.getTestId());
                            testDTO.setBillId(test.getBillId());
                            testDTO.setReportDays(test.getReportDays());
                            testDTO.setReportDate(test.getReportDate());
                            testDTO.setPrescriptionNo(test.getPrescriptionNo());
                            testDTO.setTax(test.getTax());
                            testDTO.setAmount(test.getAmount());
                            testDTO.setRadiologyTestId(test.getRadiologyTestId());
                            return testDTO;
                        })
                        .collect(Collectors.toList());
                responseDTO.setRadiologyItems(testDTOs);
            }

            return responseDTO;

        } catch (Exception e) {
            throw new RuntimeException("Error generating radiology bill: " + e.getMessage(), e);
        }
    }

    @Transactional
    public List<RadiologyBillDTO> getAllBills(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.asc("dateTime")));
        Page<HMS_TM_RadiologyBill> billsPage = billRepository.findAllByDeletedFalse(pageRequest);
        List<HMS_TM_RadiologyBill> bills = billsPage.getContent();

        return bills.stream().map(bill -> {
            RadiologyBillDTO dto = new RadiologyBillDTO();
            dto.setBillId(bill.getBillId());
            dto.setCaseId(bill.getCaseId());

            ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(bill.getPatientId());
            PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
            dto.setPatientId(patientDetails.getPatientId());
            dto.setPatientDetails(patientDetails);

            dto.setPrescriptionNo(bill.getPrescriptionNo());
            dto.setBillNo(bill.getBillNo());
            dto.setDateTime(bill.getDateTime());
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

            List<HMS_TM_RadiologyTest> tests = testRepository.findByBillId(bill.getBillId());
            List<RadiologyDTO> testDTOs = tests.stream()
                    .map(test -> {
                        RadiologyDTO testDTO = new RadiologyDTO();
                        testDTO.setTestId(test.getTestId());
                        testDTO.setBillId(test.getBillId());
                        testDTO.setReportDays(test.getReportDays());
                        testDTO.setReportDate(test.getReportDate());
                        testDTO.setTax(test.getTax());
                        testDTO.setPrescriptionNo(test.getPrescriptionNo());
                        testDTO.setAmount(test.getAmount());
                        testDTO.setSampleCollected(test.getSampleCollected());
                        testDTO.setCollectedDate(test.getCollectedDate());
                        testDTO.setRadiologyCenter(test.getRadiologyCenter());
                        testDTO.setApprovedBy(test.getApprovedBy());
                        testDTO.setApprovedDate(test.getApprovedDate());
                        testDTO.setRadiologyTestId(test.getRadiologyTestId());
                        testDTO.setUploadReport(test.getUploadReport());
                        testDTO.setResult(test.getResult());

//                        ResponseEntity<RadiologyTestDetailsDTO> labTestResponse =
//                                laboratoryManagementInterface.getRadiologyTestById(test.getRadiologyTestId());
//                        if (labTestResponse != null && labTestResponse.getStatusCode().is2xxSuccessful()) {
//                            RadiologyTestDetailsDTO testDetails = labTestResponse.getBody();
//                            if (testDetails != null) {
//                                testDTO.setRadiologyTestId(testDetails.getTestName());
//                            }
//                        }

                        ResponseEntity<RadiologyTestDetailsDTO> labTestResponse = laboratoryManagementInterface.getRadiologyTestById(test.getRadiologyTestId());
                        RadiologyTestDetailsDTO testDetails = labTestResponse.getBody();
                        testDTO.setRadiologyTestId(testDetails.getRadiologyTestId());
                        testDTO.setRadiologyDetails(testDetails);

                        return testDTO;
                    })
                    .collect(Collectors.toList());

            dto.setRadiologyItems(testDTOs);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public RadiologyBillDTO getBillById(String billId) {
        HMS_TM_RadiologyBill bill = billRepository.findByBillIdAndDeletedFalse(billId)
                .orElseThrow(() -> new RuntimeException("Radiology bill not found with ID: " + billId));

        RadiologyBillDTO dto = new RadiologyBillDTO();
        dto.setBillId(bill.getBillId());
        dto.setHospitalDoctor(bill.getHospitalDoctor());
        dto.setCaseId(bill.getCaseId());

        ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(bill.getPatientId());
        PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
        dto.setPatientId(patientDetails.getPatientId());
        dto.setPatientDetails(patientDetails);

        dto.setDateTime(bill.getDateTime());
        dto.setPrescriptionNo(bill.getPrescriptionNo());
        dto.setBillNo(bill.getBillNo());
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

        List<HMS_TM_RadiologyTest> tests = testRepository.findByBillId(bill.getBillId());
        List<RadiologyDTO> testDTOs = tests.stream()
                .map(test -> {
                    RadiologyDTO testDTO = new RadiologyDTO();
                    testDTO.setTestId(test.getTestId());
                    testDTO.setBillId(test.getBillId());
                    testDTO.setReportDays(test.getReportDays());
                    testDTO.setReportDate(test.getReportDate());
                    testDTO.setTax(test.getTax());
                    testDTO.setPrescriptionNo(test.getPrescriptionNo());
                    testDTO.setAmount(test.getAmount());
                    testDTO.setSampleCollected(test.getSampleCollected());
                    testDTO.setCollectedDate(test.getCollectedDate());
                    testDTO.setRadiologyCenter(test.getRadiologyCenter());
                    testDTO.setApprovedBy(test.getApprovedBy());
                    testDTO.setApprovedDate(test.getApprovedDate());
                    testDTO.setRadiologyTestId(test.getRadiologyTestId());
                    testDTO.setUploadReport(test.getUploadReport());
                    testDTO.setResult(test.getResult());

//                    ResponseEntity<RadiologyTestDetailsDTO> labTestResponse =
//                            laboratoryManagementInterface.getRadiologyTestById(test.getRadiologyTestId());
//                    if (labTestResponse != null && labTestResponse.getStatusCode().is2xxSuccessful()) {
//                        RadiologyTestDetailsDTO testDetails = labTestResponse.getBody();
//                        if (testDetails != null) {
//                            testDTO.setRadiologyTestId(testDetails.getTestName());
//                        }
//                    }
                    ResponseEntity<RadiologyTestDetailsDTO> labTestResponse = laboratoryManagementInterface.getRadiologyTestById(test.getRadiologyTestId());
                    RadiologyTestDetailsDTO testDetails = labTestResponse.getBody();
                    testDTO.setRadiologyTestId(testDetails.getRadiologyTestId());
                    testDTO.setRadiologyDetails(testDetails);

                    return testDTO;
                })
                .collect(Collectors.toList());

        dto.setRadiologyItems(testDTOs);

        return dto;
    }

    @Transactional
    public RadiologyBillDTO getBillByTestId(String testId) {
        HMS_TM_RadiologyTest test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Radiology test not found with ID: " + testId));

        HMS_TM_RadiologyBill bill = billRepository.findByBillIdAndDeletedFalse(test.getBillId())
                .orElseThrow(() -> new RuntimeException("Radiology bill not found with ID: " + test.getBillId()));

        RadiologyBillDTO dto = new RadiologyBillDTO();
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

        List<HMS_TM_RadiologyTest> tests = List.of(test);

        List<RadiologyDTO> testDTOs = tests.stream()
                .map(t -> {
                    RadiologyDTO testDTO = new RadiologyDTO();
                    testDTO.setTestId(t.getTestId());
                    testDTO.setBillId(t.getBillId());
                    testDTO.setRadiologyTestId(t.getRadiologyTestId());
                    testDTO.setReportDays(t.getReportDays());
                    testDTO.setPrescriptionNo(t.getPrescriptionNo());
                    testDTO.setReportDate(t.getReportDate());
                    testDTO.setTax(t.getTax());
                    testDTO.setAmount(t.getAmount());
                    testDTO.setSampleCollected(t.getSampleCollected());
                    testDTO.setCollectedDate(t.getCollectedDate());
                    testDTO.setRadiologyCenter(t.getRadiologyCenter());
                    testDTO.setApprovedBy(t.getApprovedBy());
                    testDTO.setApprovedDate(t.getApprovedDate());
                    testDTO.setUploadReport(t.getUploadReport());
                    testDTO.setResult(t.getResult());

                    ResponseEntity<RadiologyTestDetailsDTO> labTestResponse =
                            laboratoryManagementInterface.getRadiologyTestById(t.getRadiologyTestId());

                    if (labTestResponse != null && labTestResponse.getStatusCode().is2xxSuccessful()) {
                        RadiologyTestDetailsDTO testDetails = labTestResponse.getBody();

                        RadiologyTestDetailsDTO limitedDetails = new RadiologyTestDetailsDTO();
                        limitedDetails.setRadiologyTestId(testDetails.getRadiologyTestId());
                        limitedDetails.setTestName(testDetails.getTestName());

                        List<HMS_TM_Radiology_Parameters> parameters =
                                testParameterRepository.findByTestId(t.getTestId());

                        List<RadiologyTestParameterDTO> mergedParameters = testDetails.getTestParameters().stream()
                                .map(p -> {
                                    RadiologyTestParameterDTO param = new RadiologyTestParameterDTO();
                                    param.setParameterId(p.getParameterId());
                                    param.setParameterName(p.getParameterName());
                                    param.setNormalRange(p.getNormalRange());
                                    param.setUnit(p.getUnit());

                                    parameters.stream()
                                            .filter(dbParam -> dbParam.getTestId().equals(t.getTestId())
                                                    && dbParam.getParameterName().equalsIgnoreCase(p.getParameterName()))
                                            .forEach(dbParam -> {
                                                param.setReportValue(dbParam.getReportValue() != null ? dbParam.getReportValue() : null);
                                            });

                                    return param;

                                })
                                .collect(Collectors.toList());

                        limitedDetails.setTestParameters(mergedParameters);
                        testDTO.setRadiologyTestDetails(limitedDetails);
                    }

                    return testDTO;
                })
                .collect(Collectors.toList());

        dto.setRadiologyItems(testDTOs);

        return dto;
    }

    public HMS_TM_RadiologyTest updateRadiologyTestDetailsByTestId(
            String testId,
            RadiologyTestUpdateRequest updateRequest,
            MultipartFile uploadReportFile) {

        HMS_TM_RadiologyTest test = testRepository.findById(testId)
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
        saveRadiologyTestParameters(testId, updateRequest.getParameters());
        sendNotification(test.getPrescriptionNo(),updateRequest.getApprovedBy());
        return test;
    }

    private void sendNotification(String prescriptionNo, String approvedBy) {
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
        event.put("title", "Radiology Report");
        event.put("message", "The patient's radiology report (Prescription No: " + prescriptionNo + ") has been generated and approved by ["+approvedBy+"]");
        try {
            String eventMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send("radiology-labreport-completed", eventMessage);
            System.out.println("Published Event: " + eventMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void saveRadiologyTestParameters(String testId, List<RadiologyTestParameterDTO> parameters) {
        for (RadiologyTestParameterDTO parameterDTO : parameters) {
            HMS_TM_Radiology_Parameters parameter = new HMS_TM_Radiology_Parameters();
            parameter.setTestId(testId);
            parameter.setParameterName(parameterDTO.getParameterName());
            parameter.setNormalRange(parameterDTO.getNormalRange());
            parameter.setReportValue(parameterDTO.getReportValue());
            parameter.setUnit(parameterDTO.getUnit());

            testParameterRepository.save(parameter);
        }
    }

    public HMS_TM_RadiologyTest updateRadiologyTest(String testId, RadiologyBillUpdateDTO updateDTO) {
        HMS_TM_RadiologyTest test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));

        test.setSampleCollected(updateDTO.getSampleCollected());
        test.setCollectedDate(updateDTO.getCollectedDate());
        test.setRadiologyCenter(updateDTO.getRadiologyCenter());

        return testRepository.save(test);
    }

    @Transactional
    public RadiologyBillDTO updateRadiologyBill(
            String billId,
            String radiologyDataJson,
            MultipartFile photoFile) {

        try {
            RadiologyBillDTO billDTO = objectMapper.readValue(radiologyDataJson, RadiologyBillDTO.class);

            HMS_TM_RadiologyBill radiologyBill = billRepository.findById(billId)
                    .orElseThrow(() -> new RuntimeException("Radiology bill not found with ID: " + billId));

            radiologyBill.setHospitalDoctor(billDTO.getHospitalDoctor());
            radiologyBill.setBillNo(billDTO.getBillNo());
            radiologyBill.setCaseId(billDTO.getCaseId());
            radiologyBill.setPatientId(billDTO.getPatientId());
            radiologyBill.setPrescriptionNo(billDTO.getPrescriptionNo());
            radiologyBill.setDoctorName(billDTO.getDoctorName());
            radiologyBill.setDateTime(LocalDateTime.now());
            radiologyBill.setNote(billDTO.getNote());
            radiologyBill.setPreviousReportValue(billDTO.getPreviousReportValue());
            radiologyBill.setTotalAmount(billDTO.getTotalAmount());
            radiologyBill.setDiscount(billDTO.getDiscount());
            radiologyBill.setTax(billDTO.getTax());
            radiologyBill.setNetAmount(billDTO.getNetAmount());
            radiologyBill.setPaymentMode(billDTO.getPaymentMode());
            radiologyBill.setChequeNo(billDTO.getChequeNo());
            radiologyBill.setChequeDate(billDTO.getChequeDate());
            radiologyBill.setIpdOrOpdId(billDTO.getIpdOrOpdId());

            Double previousPaymentAmount = radiologyBill.getPaymentAmount() != null ? radiologyBill.getPaymentAmount() : 0.0;
            Double balanceAmount = radiologyBill.getNetAmount() - previousPaymentAmount;

            Double newPayment = billDTO.getPaymentAmount();
            if (newPayment != null && newPayment > 0) {
                radiologyBill.setPaymentAmount(previousPaymentAmount + newPayment);
                balanceAmount -= newPayment;
            }

            radiologyBill.setBalanceAmount(balanceAmount > 0 ? balanceAmount : 0.0);

            if (photoFile != null) {
                byte[] photoBytes = photoFile.getBytes();
                String encodedPhoto = Base64.getEncoder().encodeToString(photoBytes);
                radiologyBill.setAttachDocument(encodedPhoto);
            }

            List<RadiologyDTO> radiologyDTOList = new ArrayList<>();
            if (billDTO.getRadiologyItems() != null) {
                for (RadiologyDTO radiologyDTO : billDTO.getRadiologyItems()) {
                    HMS_TM_RadiologyTest radiologyTest;

                    if (radiologyDTO.getTestId() != null) {
                        radiologyTest = testRepository.findById(radiologyDTO.getTestId())
                                .orElseThrow(() -> new RuntimeException("Radiology test not found with ID: " + radiologyDTO.getTestId()));
                    } else {
                        radiologyTest = new HMS_TM_RadiologyTest();
                    }

                    radiologyTest.setTestId(radiologyDTO.getTestId());
                    radiologyTest.setRadiologyTestId(radiologyDTO.getRadiologyTestId());
                    radiologyTest.setReportDays(radiologyDTO.getReportDays());
                    radiologyTest.setPrescriptionNo(radiologyDTO.getPrescriptionNo());
                    radiologyTest.setReportDate(radiologyDTO.getReportDate());
                    radiologyTest.setTax(radiologyDTO.getTax());
                    radiologyTest.setAmount(radiologyDTO.getAmount());

                    radiologyTest.setBillId(radiologyBill.getBillId());

                    radiologyTest = testRepository.save(radiologyTest);

                    RadiologyDTO savedRadiologyDTO = new RadiologyDTO();
                    savedRadiologyDTO.setTestId(radiologyTest.getTestId());
                    savedRadiologyDTO.setRadiologyTestId(radiologyTest.getRadiologyTestId());
                    savedRadiologyDTO.setReportDays(radiologyTest.getReportDays());
                    savedRadiologyDTO.setReportDate(radiologyTest.getReportDate());
                    savedRadiologyDTO.setTax(radiologyTest.getTax());
                    savedRadiologyDTO.setAmount(radiologyTest.getAmount());

                    radiologyDTOList.add(savedRadiologyDTO);
                }
            }

            billRepository.save(radiologyBill);

            RadiologyBillDTO responseDTO = new RadiologyBillDTO();
            responseDTO.setBillId(radiologyBill.getBillId());
            responseDTO.setBillNo(radiologyBill.getBillNo());
            responseDTO.setCaseId(radiologyBill.getCaseId());
            responseDTO.setPatientId(radiologyBill.getPatientId());
            responseDTO.setPrescriptionNo(radiologyBill.getPrescriptionNo());
            responseDTO.setDateTime(radiologyBill.getDateTime());
            responseDTO.setHospitalDoctor(radiologyBill.getHospitalDoctor());
            responseDTO.setDoctorName(radiologyBill.getDoctorName());
            responseDTO.setNote(radiologyBill.getNote());
            responseDTO.setPreviousReportValue(radiologyBill.getPreviousReportValue());
            responseDTO.setTotalAmount(radiologyBill.getTotalAmount());
            responseDTO.setDiscount(radiologyBill.getDiscount());
            responseDTO.setTax(radiologyBill.getTax());
            responseDTO.setNetAmount(radiologyBill.getNetAmount());
            responseDTO.setPaymentMode(radiologyBill.getPaymentMode());
            responseDTO.setPaymentAmount(radiologyBill.getPaymentAmount());
            responseDTO.setBalanceAmount(radiologyBill.getBalanceAmount());
            responseDTO.setChequeDate(radiologyBill.getChequeDate());
            responseDTO.setChequeNo(radiologyBill.getChequeNo());
            responseDTO.setAttachDocument(radiologyBill.getAttachDocument());
            responseDTO.setIpdOrOpdId(radiologyBill.getIpdOrOpdId());

            responseDTO.setRadiologyItems(radiologyDTOList);

            return responseDTO;

        } catch (Exception e) {
            throw new RuntimeException("Error updating radiology bill: " + e.getMessage(), e);
        }
    }

    public void deleteRadiologyPathologyBill(String billId) {
        Optional<HMS_TM_RadiologyBill> billOptional = billRepository.findById(billId);
        if (billOptional.isPresent()) {
            HMS_TM_RadiologyBill bill = billOptional.get();
            bill.setDeleted(true);
            billRepository.save(bill);
        } else {
            throw new RuntimeException("Radiology Bill not found with ID: " + billId);
        }
    }
//    public IncomeChanges getRadiologyIncome() {
//        Double income = billRepository.getTotalRadiologyIncome();
//        return income != null ? income : 0.0;
//    }

        public IncomeChanges getRadiologyIncome() {
        Double todayIncome  = billRepository.getTotalRadiologyIncome();
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Double yesterdayIncome   = billRepository.getYesterdayRadiologyIncome(yesterday);
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


    public Double getMonthlyRadiologyIncome() {
        Double monthlyIncome  = billRepository.getMonthlyTotalRadiologyIncome();
        return (monthlyIncome != null) ? monthlyIncome : 0.0;
    }

    public List<RadiologyTestDTO> getRadiologyTestsByIds(List<String> ids,String prescriptionNo) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        List<String> billIds = billRepository.findAllBillIdsByPrescriptionNoAndDeletedFalse(prescriptionNo);
        if(billIds!=null && !billIds.isEmpty()) {
            List<HMS_TM_RadiologyTest> tests = testRepository.findAllByBillIdIn(billIds);
            return tests.stream().map(test -> {
                RadiologyTestDTO dto = new RadiologyTestDTO();
                dto.setRadiologyTestId(test.getRadiologyTestId());
                ResponseEntity<RadiologyTestDetailsDTO> labTestResponse =
                        laboratoryManagementInterface.getRadiologyTestById(test.getRadiologyTestId());
                dto.setTestName(labTestResponse.getBody().getTestName());
                dto.setTestId(test.getTestId());
                dto.setReportDays(test.getReportDays());
                dto.setReportDate(test.getReportDate());
                dto.setTax(test.getTax());
                dto.setAmount(test.getAmount());
                dto.setSampleCollected(test.getSampleCollected());
                dto.setApprovedBy(test.getApprovedBy());
                dto.setCollectedDate(test.getCollectedDate());
                dto.setRadiologyCenter(test.getRadiologyCenter());
                dto.setApprovedDate(test.getApprovedDate());
                dto.setUploadReport(test.getUploadReport());
                dto.setResult(test.getResult());
                dto.setBillId(test.getBillId());
                List<RadiologyTestParameterDTO> responseParameters = testParameterRepository
                        .findByTestId(test.getTestId()).stream()
                        .map(param -> {
                            RadiologyTestParameterDTO responseParam = new RadiologyTestParameterDTO();
                            responseParam.setParameterName(param.getParameterName());
                            responseParam.setParameterId(param.getParameterId());
                            responseParam.setRadiologyTestId(param.getTestId());
                            responseParam.setNormalRange(param.getNormalRange());
                            responseParam.setReportValue(param.getReportValue());
                            responseParam.setUnit(param.getUnit());
                            return responseParam;
                        }).collect(Collectors.toList());

                dto.setTestParameters(responseParameters);
                return dto;
            }).collect(Collectors.toList());

        }else {
//            List<HMS_TM_RadiologyTest> tests = testRepository.findByRadiologyTestIdInAndCollectedDateIsNull(ids);
//            List<HMS_TM_RadiologyTest> tests = testRepository.findByRadiologyTestIdInAndPrescriptionNo(ids,prescriptionNo);
            List<HMS_TM_RadiologyTest> tests = ids.stream()
                    .map(id -> {
                        HMS_TM_RadiologyTest test = new HMS_TM_RadiologyTest();
                        test.setRadiologyTestId(id);
                        return test;
                    })
                    .collect(Collectors.toList());
            if (tests.isEmpty()) {
                return Collections.emptyList();
            }
            return tests.stream().map(test -> {
                RadiologyTestDTO dto = new RadiologyTestDTO();
                dto.setRadiologyTestId(test.getRadiologyTestId());
                ResponseEntity<RadiologyTestDetailsDTO> labTestResponse =
                        laboratoryManagementInterface.getRadiologyTestById(test.getRadiologyTestId());
                dto.setTestName(labTestResponse.getBody().getTestName());
                dto.setTestId(test.getTestId());
                dto.setReportDays(test.getReportDays());
                dto.setReportDate(test.getReportDate());
                dto.setTax(test.getTax());
                dto.setAmount(test.getAmount());
                dto.setSampleCollected(test.getSampleCollected());
                dto.setApprovedBy(test.getApprovedBy());
                dto.setCollectedDate(test.getCollectedDate());
                dto.setRadiologyCenter(test.getRadiologyCenter());
                dto.setApprovedDate(test.getApprovedDate());
                dto.setUploadReport(test.getUploadReport());
                dto.setResult(test.getResult());
                dto.setBillId(test.getBillId());
                List<RadiologyTestParameterDTO> responseParameters = testParameterRepository
                        .findByTestId(test.getTestId()).stream()
                        .map(param -> {
                            RadiologyTestParameterDTO responseParam = new RadiologyTestParameterDTO();
                            responseParam.setParameterName(param.getParameterName());
                            responseParam.setParameterId(param.getParameterId());
                            responseParam.setRadiologyTestId(param.getTestId());
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

//    public List<RadiologyTestDTO> getRadiologyTestsByIds(List<String> ids,String id) {
//        Optional<String> optionalBillId = billRepository.findBillIdByIpdOrOpdId(id);
//        if (optionalBillId.isEmpty()) {
//            return Collections.emptyList();
//        }
//        List<HMS_TM_RadiologyTest> tests = testRepository.findAllByBillId(optionalBillId);
//        if (tests.isEmpty()) {
//            return Collections.emptyList();
//        }
//        return tests.stream().map(test -> {
//            RadiologyTestDTO dto = new RadiologyTestDTO();
//            dto.setRadiologyTestId(test.getRadiologyTestId());
//            ResponseEntity<RadiologyTestDetailsDTO> labTestResponse =
//                    laboratoryManagementInterface.getRadiologyTestById(test.getRadiologyTestId());
//            dto.setTestName(labTestResponse.getBody().getTestName());
//            dto.setTestId(test.getTestId());
//            dto.setReportDays(test.getReportDays());
//            dto.setReportDate(test.getReportDate());
//            dto.setTax(test.getTax());
//            dto.setAmount(test.getAmount());
//            dto.setSampleCollected(test.getSampleCollected());
//            dto.setApprovedBy(test.getApprovedBy());
//            dto.setCollectedDate(test.getCollectedDate());
//            dto.setRadiologyCenter(test.getRadiologyCenter());
//            dto.setApprovedDate(test.getApprovedDate());
//            dto.setUploadReport(test.getUploadReport());
//            dto.setResult(test.getResult());
//            dto.setBillId(test.getBillId());
//            List<RadiologyTestParameterDTO> responseParameters = testParameterRepository
//                    .findByTestId(test.getTestId()).stream()
//                    .map(param -> {
//                        RadiologyTestParameterDTO responseParam = new RadiologyTestParameterDTO();
//                        responseParam.setParameterName(param.getParameterName());
//                        responseParam.setParameterId(param.getParameterId());
//                        responseParam.setRadiologyTestId(param.getTestId());
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

    public BillSummary getRadiologyOpdAndIpdPayment(String ipdOrOpdId) {
        return billRepository.findSummaryByIpdOrOpdId(ipdOrOpdId)
                .orElse(new BillSummary(ipdOrOpdId, 0.0, 0.0));
    }

    public Integer getMedicalHistoryRadiology(String patientId) {
        Integer radiology=billRepository.countByPatientId(patientId);
        return (radiology != null) ? radiology : 0;
    }

    public IncomeChanges getRadiologyIncreaseMonthlyIncome() {
        Double currentMonthIncome = billRepository.getTotalRadiologyIncomeForMonth(LocalDate.now().getMonthValue(), LocalDate.now().getYear());
        LocalDate previousMonth = LocalDate.now().minusMonths(1);
        Double previousMonthIncome = billRepository.getTotalRadiologyIncomeForMonth(previousMonth.getMonthValue(), previousMonth.getYear());
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

    public IncomeChanges getRadiologyIncreaseYearlyIncome() {
        int currentYear = LocalDate.now().getYear();
        int previousYear = currentYear - 1;
        Double currentYearIncome = billRepository.getTotalRadiologyIncomeForYear(currentYear);
        Double previousYearIncome = billRepository.getTotalRadiologyIncomeForYear(previousYear);
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

    public IncomeChanges getRadiologyIncreaseWeeklyIncome() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        LocalDate previousWeekDate = LocalDate.now().minusWeeks(1);
        int previousWeek = previousWeekDate.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int previousYear = previousWeekDate.getYear();
        Double currentWeekIncome = billRepository.getTotalRadiologyIncomeForWeek(currentWeek, currentYear);
        Double previousWeekIncome = billRepository.getTotalRadiologyIncomeForWeek(previousWeek, previousYear);
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
    public List<HMS_TM_RadiologyBill> getRadiologyBillByIpdOrOpdId(String ipdOrOpdId) {
        return billRepository.findByIpdOrOpdIdAndDeletedFalse(ipdOrOpdId);
    }

    @Transactional
    public List<RadiologyBillResponse> searchRadiologyBills(
            String sampleCollector,
            String categoryName,
            String testName,
            String timeDuration,
            LocalDate startDate,
            LocalDate endDate) {

        LocalDateTime[] dateRange = calculateDateRange(timeDuration, startDate, endDate);
        LocalDateTime startDateTime = dateRange[0];
        LocalDateTime endDateTime = dateRange[1];

        List<HMS_TM_RadiologyBill> bills = billRepository.findBillsWithFilters(
                sampleCollector,
                startDateTime,
                endDateTime
        );

        Set<RadiologyBillResponse> responseSet = new HashSet<>();

        for (HMS_TM_RadiologyBill bill : bills) {
            responseSet.addAll(convertToRadiologyResponse(bill, categoryName, testName, sampleCollector));
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

    private List<RadiologyBillResponse> convertToRadiologyResponse(
            HMS_TM_RadiologyBill bill,
            String categoryName,
            String testName,
            String sampleCollectedFilter) {

        List<RadiologyBillResponse> responses = new ArrayList<>();
        PatientsDTO patient = patientManagementInterface.getPatientById(bill.getPatientId()).getBody();
        String patientName = patient != null ? patient.getFirstName() + " " + patient.getLastName() : "Unknown";

        List<HMS_TM_RadiologyTest> tests = testRepository.findByBillId(bill.getBillId());
        Set<String> addedBills = new HashSet<>();

        for (HMS_TM_RadiologyTest test : tests) {
            RadiologyTestDetailsDTO testDetails = laboratoryManagementInterface
                    .getRadiologyTestById(test.getRadiologyTestId()).getBody();

            if (testDetails != null) {
                boolean matchesCategory = categoryName == null || categoryName.equalsIgnoreCase(testDetails.getCategoryName());
                boolean matchesTestName = testName == null || testDetails.getTestName().equalsIgnoreCase(testName);
                boolean matchesSampleCollected = sampleCollectedFilter == null
                        || (test.getSampleCollected() != null && test.getSampleCollected().equalsIgnoreCase(sampleCollectedFilter));

                if (matchesCategory && matchesTestName && matchesSampleCollected) {
                    if (!addedBills.contains(bill.getBillNo())) {
                        RadiologyBillResponse response = new RadiologyBillResponse();
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

    public List<HMS_TM_RadiologyBill> fetchAllRadiologyIncomeForToday() {
        return billRepository.getAllRadiologyIncomeForToday();
    }

    public List<HMS_TM_RadiologyBill> fetchAllRadiologyIncomeForMonth() {
        int month = LocalDate.now().getMonthValue();
        int year = LocalDate.now().getYear();
        return billRepository.getAllRadiologyIncomeForMonth(month, year);
    }

    public List<HMS_TM_RadiologyBill> fetchAllRadiologyIncomeForYear() {
        int year = LocalDate.now().getYear();
        return billRepository.getAllRadiologyIncomeForYear(year);
    }

    public List<HMS_TM_RadiologyBill> fetchAllRadiologyIncomeForWeek() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        return billRepository.getAllRadiologyIncomeForWeek(currentWeek, currentYear);
    }
}



