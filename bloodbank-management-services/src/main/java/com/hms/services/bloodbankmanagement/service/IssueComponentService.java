package com.hms.services.bloodbankmanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.bloodbankmanagement.configuration.PatientManagementInterface;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_BagStock;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_BloodComponent;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_DonorDetails;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_IssueComponent;
import com.hms.services.bloodbankmanagement.model.BloodComponentDTO;
import com.hms.services.bloodbankmanagement.model.IssueComponentDTO;
import com.hms.services.bloodbankmanagement.model.PatientsDTO;
import com.hms.services.bloodbankmanagement.repository.BagStockRepository;
import com.hms.services.bloodbankmanagement.repository.BloodComponentRepository;
import com.hms.services.bloodbankmanagement.repository.DonorDetailsRepository;
import com.hms.services.bloodbankmanagement.model.BillSummary;
import com.hms.services.bloodbankmanagement.repository.IssueComponentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IssueComponentService {

    @Autowired
    private IssueComponentRepository issueComponentRepository;
    @Autowired
    private PatientManagementInterface patientManagementInterface;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private BagStockRepository bagStockRepository;
    @Autowired
    private DonorDetailsRepository donorDetailsRepository;
    @Autowired
    private BloodComponentRepository bloodComponentRepository;


    public HMS_TM_IssueComponent generateIssueComponent(String componentDataJson, MultipartFile photoFile) throws IOException, IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_IssueComponent issueComponent = objectMapper.readValue(componentDataJson, HMS_TM_IssueComponent.class);
        issueComponent.setCreatedAt(LocalDateTime.now());
        String maxId = issueComponentRepository.findMaxIssueComponentId();
        int nextId = (maxId == null) ? 1 : Integer.parseInt(maxId.substring(5)) + 1;
        String generatedId = "BIB" + String.format("%04d", nextId);
        issueComponent.setIssueComponentId(generatedId);

        double netAmount = issueComponent.getNetAmount() != null ? issueComponent.getNetAmount() : 0.0;
        double paymentAmount = issueComponent.getPaymentAmount() != null ? issueComponent.getPaymentAmount() : 0.0;
        double balanceAmount = netAmount - paymentAmount;
        issueComponent.setBalanceAmount(balanceAmount > 0 ? balanceAmount : 0.0);

        if (photoFile != null) {
            byte[] photoBytes = photoFile.getBytes();
            String encodedPhoto = Base64.getEncoder().encodeToString(photoBytes);
            issueComponent.setAttachDocument(encodedPhoto);
        }

        return issueComponentRepository.save(issueComponent);
    }

//    @Transactional
//    public List<IssueComponentDTO> getAllIssueComponents() {
//        List<HMS_TM_IssueComponent> issueComponentRecords = issueComponentRepository.findAllByDeletedFalse();
//
//        List<IssueComponentDTO> dtoList = new ArrayList<>();
//        for (HMS_TM_IssueComponent issueComponent : issueComponentRecords) {
//            IssueComponentDTO dto = new IssueComponentDTO();
//            dto.setIssueComponentId(issueComponent.getIssueComponentId());
//            dto.setPatientId(issueComponent.getPatientId());
//            dto.setCaseId(issueComponent.getCaseId());
//            dto.setIpdOrOpdId(issueComponent.getIpdOrOpdId());
//            dto.setIssueDate(issueComponent.getIssueDate());
//            dto.setHospitalDoctor(issueComponent.getHospitalDoctor());
//            dto.setReferenceName(issueComponent.getReferenceName());
//            dto.setTechnician(issueComponent.getTechnician());
//            dto.setBloodGroup(issueComponent.getBloodGroup());
//            dto.setComponents(issueComponent.getComponents());
//            dto.setBagStockId(issueComponent.getBagStockId());
//            dto.setChargeCategory(issueComponent.getChargeCategory());
//            dto.setChargeName(issueComponent.getChargeName());
//            dto.setStandardCharge(issueComponent.getStandardCharge());
//            dto.setNote(issueComponent.getNote());
//            dto.setTotal(issueComponent.getTotal());
//            dto.setDiscount(issueComponent.getDiscount());
//            dto.setTax(issueComponent.getTax());
//            dto.setNetAmount(issueComponent.getNetAmount());
//            dto.setPaymentMode(issueComponent.getPaymentMode());
//            dto.setPaymentAmount(issueComponent.getPaymentAmount());
//            dto.setBalanceAmount(issueComponent.getBalanceAmount());
//            dto.setChequeNo(issueComponent.getChequeNo());
//            dto.setChequeDate(issueComponent.getChequeDate());
//            dto.setAttachDocument(issueComponent.getAttachDocument());
//            dto.setDeleted(issueComponent.getDeleted());
//
//            ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(issueComponent.getPatientId());
//            PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
//            dto.setPatientDetails(patientDetails);
//
//            dtoList.add(dto);
//        }
//
//        return dtoList;
//    }
//
//    @Transactional
//    public Optional<IssueComponentDTO> getIssueComponentById(String id) {
//        HMS_TM_IssueComponent issueComponent = issueComponentRepository.findByIssueComponentIdAndDeletedFalse(id)
//                .orElseThrow(() -> new RuntimeException("Issue component record not found with ID: " + id));
//
//        IssueComponentDTO dto = new IssueComponentDTO();
//        dto.setIssueComponentId(issueComponent.getIssueComponentId());
//        dto.setPatientId(issueComponent.getPatientId());
//        dto.setCaseId(issueComponent.getCaseId());
//        dto.setIpdOrOpdId(issueComponent.getIpdOrOpdId());
//        dto.setIssueDate(issueComponent.getIssueDate());
//        dto.setHospitalDoctor(issueComponent.getHospitalDoctor());
//        dto.setReferenceName(issueComponent.getReferenceName());
//        dto.setTechnician(issueComponent.getTechnician());
//        dto.setBloodGroup(issueComponent.getBloodGroup());
//        dto.setComponents(issueComponent.getComponents());
//        dto.setBagStockId(issueComponent.getBagStockId());
//        dto.setChargeCategory(issueComponent.getChargeCategory());
//        dto.setChargeName(issueComponent.getChargeName());
//        dto.setStandardCharge(issueComponent.getStandardCharge());
//        dto.setNote(issueComponent.getNote());
//        dto.setTotal(issueComponent.getTotal());
//        dto.setDiscount(issueComponent.getDiscount());
//        dto.setTax(issueComponent.getTax());
//        dto.setNetAmount(issueComponent.getNetAmount());
//        dto.setPaymentMode(issueComponent.getPaymentMode());
//        dto.setPaymentAmount(issueComponent.getPaymentAmount());
//        dto.setBalanceAmount(issueComponent.getBalanceAmount());
//        dto.setChequeNo(issueComponent.getChequeNo());
//        dto.setChequeDate(issueComponent.getChequeDate());
//        dto.setAttachDocument(issueComponent.getAttachDocument());
//        dto.setDeleted(issueComponent.getDeleted());
//
//        ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(issueComponent.getPatientId());
//        PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
//        dto.setPatientDetails(patientDetails);
//
//        return Optional.of(dto);
//    }

    @Transactional
    public List<IssueComponentDTO> getAllIssueComponents() {
        List<HMS_TM_IssueComponent> issueComponentRecords = issueComponentRepository.findAllByDeletedFalse();

        return issueComponentRecords.stream().map(issueComponent -> {
            IssueComponentDTO dto = new IssueComponentDTO();
            dto.setIssueComponentId(issueComponent.getIssueComponentId());
            dto.setPatientId(issueComponent.getPatientId());
            dto.setCaseId(issueComponent.getCaseId());
            dto.setIpdOrOpdId(issueComponent.getIpdOrOpdId());
            dto.setIssueDate(issueComponent.getIssueDate());
            dto.setHospitalDoctor(issueComponent.getHospitalDoctor());
            dto.setReferenceName(issueComponent.getReferenceName());
            dto.setTechnician(issueComponent.getTechnician());
            dto.setBloodGroup(issueComponent.getBloodGroup());
            dto.setComponents(issueComponent.getComponents());
            dto.setChargeCategory(issueComponent.getChargeCategory());
            dto.setChargeName(issueComponent.getChargeName());
            dto.setStandardCharge(issueComponent.getStandardCharge());
            dto.setNote(issueComponent.getNote());
            dto.setTotal(issueComponent.getTotal());
            dto.setDiscount(issueComponent.getDiscount());
            dto.setTax(issueComponent.getTax());
            dto.setNetAmount(issueComponent.getNetAmount());
            dto.setPaymentMode(issueComponent.getPaymentMode());
            dto.setPaymentAmount(issueComponent.getPaymentAmount());
            dto.setBalanceAmount(issueComponent.getBalanceAmount());
            dto.setChequeNo(issueComponent.getChequeNo());
            dto.setChequeDate(issueComponent.getChequeDate());
            dto.setAttachDocument(issueComponent.getAttachDocument());
            dto.setDeleted(issueComponent.getDeleted());
            dto.setGstAdded(issueComponent.isGstAdded());

            ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(issueComponent.getPatientId());
            PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
            dto.setPatientDetails(patientDetails);

            bloodComponentRepository.findById(issueComponent.getComponentId()).ifPresent(bloodComponent -> {
                bagStockRepository.findById(bloodComponent.getBagStockId()).ifPresent(bagStock -> {
                    String formattedComponentId = String.format("%s (%s %s)",
                            bagStock.getBagNo(),
                            bloodComponent.getVolume(),
                            bloodComponent.getUnit()
                    );

                    dto.setComponentId(formattedComponentId);

                    donorDetailsRepository.findById(bagStock.getDonorId()).ifPresent(donor -> {
                        dto.setDonorName(donor.getDonorName());
                        dto.setDonorGender(donor.getGender());
                    });
                });
            });
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public Optional<IssueComponentDTO> getIssueComponentById(String id) {
        HMS_TM_IssueComponent issueComponent = issueComponentRepository.findByIssueComponentIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Issue component record not found with ID: " + id));

        IssueComponentDTO dto = new IssueComponentDTO();
        dto.setIssueComponentId(issueComponent.getIssueComponentId());
        dto.setPatientId(issueComponent.getPatientId());
        dto.setCaseId(issueComponent.getCaseId());
        dto.setIpdOrOpdId(issueComponent.getIpdOrOpdId());
        dto.setIssueDate(issueComponent.getIssueDate());
        dto.setHospitalDoctor(issueComponent.getHospitalDoctor());
        dto.setReferenceName(issueComponent.getReferenceName());
        dto.setTechnician(issueComponent.getTechnician());
        dto.setBloodGroup(issueComponent.getBloodGroup());
        dto.setComponents(issueComponent.getComponents());
        dto.setChargeCategory(issueComponent.getChargeCategory());
        dto.setChargeName(issueComponent.getChargeName());
        dto.setStandardCharge(issueComponent.getStandardCharge());
        dto.setNote(issueComponent.getNote());
        dto.setTotal(issueComponent.getTotal());
        dto.setDiscount(issueComponent.getDiscount());
        dto.setTax(issueComponent.getTax());
        dto.setNetAmount(issueComponent.getNetAmount());
        dto.setPaymentMode(issueComponent.getPaymentMode());
        dto.setPaymentAmount(issueComponent.getPaymentAmount());
        dto.setBalanceAmount(issueComponent.getBalanceAmount());
        dto.setChequeNo(issueComponent.getChequeNo());
        dto.setChequeDate(issueComponent.getChequeDate());
        dto.setAttachDocument(issueComponent.getAttachDocument());
        dto.setDeleted(issueComponent.getDeleted());
        dto.setGstAdded(issueComponent.isGstAdded());

        ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(issueComponent.getPatientId());
        PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
        dto.setPatientDetails(patientDetails);

        Optional<HMS_TM_BloodComponent> bloodComponentOpt = bloodComponentRepository.findById(issueComponent.getComponentId());
        if (bloodComponentOpt.isPresent()) {
            HMS_TM_BloodComponent bloodComponent = bloodComponentOpt.get();

            BloodComponentDTO bloodComponentDTO = new BloodComponentDTO();
            bloodComponentDTO.setComponentId(bloodComponent.getComponentId());
            bloodComponentDTO.setBloodGroup(bloodComponent.getBloodGroup());
            bloodComponentDTO.setComponentName(bloodComponent.getComponentName());
            bloodComponentDTO.setComponentBag(bloodComponent.getComponentBag());
            bloodComponentDTO.setVolume(bloodComponent.getVolume());
            bloodComponentDTO.setUnit(bloodComponent.getUnit());
            bloodComponentDTO.setLot(bloodComponent.getLot());
            bloodComponentDTO.setInstitution(bloodComponent.getInstitution());

            dto.setBloodComponent(bloodComponentDTO);
        }

        return Optional.of(dto);
    }

    public HMS_TM_IssueComponent updateIssueComponent(String id, String componentDataJson, MultipartFile photoFile) throws IOException {
        if (!issueComponentRepository.existsById(id)) {
            throw new EntityNotFoundException("Issue Component with ID " + id + " not found.");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_IssueComponent issueComponent = objectMapper.readValue(componentDataJson, HMS_TM_IssueComponent.class);

        HMS_TM_IssueComponent existingComponent = issueComponentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Issue Component with ID " + id + " not found."));

        issueComponent.setIssueComponentId(id);

        Double previousPaymentAmount = existingComponent.getPaymentAmount() != null ? existingComponent.getPaymentAmount() : 0.0;
        Double netAmount = existingComponent.getNetAmount() != null ? existingComponent.getNetAmount() : 0.0;
        Double newPaymentAmount = issueComponent.getPaymentAmount() != null ? issueComponent.getPaymentAmount() : 0.0;
        issueComponent.setPaymentAmount(previousPaymentAmount + newPaymentAmount);
        Double updatedPaymentAmount = issueComponent.getPaymentAmount();
        issueComponent.setBalanceAmount(updatedPaymentAmount < netAmount ? netAmount - updatedPaymentAmount : 0.0);

        if (photoFile != null) {
            byte[] photoBytes = photoFile.getBytes();
            String encodedPhoto = Base64.getEncoder().encodeToString(photoBytes);
            issueComponent.setAttachDocument(encodedPhoto);
        } else {
            issueComponent.setAttachDocument(existingComponent.getAttachDocument());
        }

        return issueComponentRepository.save(issueComponent);
    }

    public HMS_TM_IssueComponent softDeleteIssueComponent(String id) {
        Optional<HMS_TM_IssueComponent> existingIssueComponentOpt = issueComponentRepository.findById(id);

        if (existingIssueComponentOpt.isPresent()) {
            HMS_TM_IssueComponent existingIssueComponent = existingIssueComponentOpt.get();
            existingIssueComponent.setDeleted(true);
            return issueComponentRepository.save(existingIssueComponent);
        } else {
            throw new RuntimeException("Pharmacy Bill not found with ID: " + id);
        }
    }
    public BillSummary getIssueComponentOpdAndIpdPayment(String ipdOrOpdId) {
        return issueComponentRepository.getIssueComponentOpdAndIpdPayment(ipdOrOpdId)
                .orElse(new BillSummary(ipdOrOpdId, 0.0, 0.0));

    }

    @Transactional
    public List<HMS_TM_IssueComponent> getIssueComponentByIpdOrOpdId(String ipdOrOpdId) {
        return issueComponentRepository.findByIpdOrOpdIdAndDeletedFalse(ipdOrOpdId);
    }
@Transactional
    public List<HMS_TM_IssueComponent> fetchAllIssueComponentIncomeForToday() {
        return issueComponentRepository.getAllIssueComponentIncomeForToday();
    }
@Transactional
    public List<HMS_TM_IssueComponent> fetchAllIssueComponentIncomeForMonth() {
        int month = LocalDate.now().getMonthValue();
        int year = LocalDate.now().getYear();
        return issueComponentRepository.getAllIssueComponentIncomeForMonth(month, year);
    }
@Transactional
    public List<HMS_TM_IssueComponent> fetchAllIssueComponentIncomeForYear() {
        int year = LocalDate.now().getYear();
        return issueComponentRepository.getAllIssueComponentIncomeForYear(year);
    }
@Transactional
    public List<HMS_TM_IssueComponent> fetchAllIssueComponentIncomeForWeek() {
        LocalDate now = LocalDate.now();
        LocalDate startOfCurrentWeek = now.with(DayOfWeek.MONDAY);
        Date startOfWeekSql = Date.valueOf(startOfCurrentWeek);
        Date nowSql = Date.valueOf(now);
        return issueComponentRepository.getAllIssueComponentIncomeForWeek(startOfWeekSql, nowSql);
    }

    @Transactional
    public List<IssueComponentDTO> getFilteredIssueComponents(String patientId, String ipdOrOpdId) {
        List<HMS_TM_IssueComponent> issueComponentRecords;

        if (patientId != null && ipdOrOpdId != null) {
            issueComponentRecords = issueComponentRepository.findByPatientIdAndIpdOrOpdIdAndDeletedFalse(patientId, ipdOrOpdId);
        } else if (patientId != null) {
            issueComponentRecords = issueComponentRepository.findByPatientIdAndDeletedFalse(patientId);
        } else if (ipdOrOpdId != null) {
            issueComponentRecords = issueComponentRepository.findByIpdOrOpdIdAndDeletedFalse(ipdOrOpdId);
        } else {
            issueComponentRecords = issueComponentRepository.findAllByDeletedFalse();
        }

        return issueComponentRecords.stream().map(issueComponent -> {
            IssueComponentDTO dto = new IssueComponentDTO();
            dto.setIssueComponentId(issueComponent.getIssueComponentId());
            dto.setPatientId(issueComponent.getPatientId());
            dto.setCaseId(issueComponent.getCaseId());
            dto.setIpdOrOpdId(issueComponent.getIpdOrOpdId());
            dto.setIssueDate(issueComponent.getIssueDate());
            dto.setHospitalDoctor(issueComponent.getHospitalDoctor());
            dto.setReferenceName(issueComponent.getReferenceName());
            dto.setTechnician(issueComponent.getTechnician());
            dto.setBloodGroup(issueComponent.getBloodGroup());
            dto.setComponents(issueComponent.getComponents());
            dto.setChargeCategory(issueComponent.getChargeCategory());
            dto.setChargeName(issueComponent.getChargeName());
            dto.setStandardCharge(issueComponent.getStandardCharge());
            dto.setNote(issueComponent.getNote());
            dto.setTotal(issueComponent.getTotal());
            dto.setDiscount(issueComponent.getDiscount());
            dto.setTax(issueComponent.getTax());
            dto.setNetAmount(issueComponent.getNetAmount());
            dto.setPaymentMode(issueComponent.getPaymentMode());
            dto.setPaymentAmount(issueComponent.getPaymentAmount());
            dto.setBalanceAmount(issueComponent.getBalanceAmount());
            dto.setChequeNo(issueComponent.getChequeNo());
            dto.setChequeDate(issueComponent.getChequeDate());
            dto.setAttachDocument(issueComponent.getAttachDocument());
            dto.setDeleted(issueComponent.getDeleted());
            dto.setGstAdded(issueComponent.isGstAdded());

            ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(issueComponent.getPatientId());
            PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
            dto.setPatientDetails(patientDetails);

            bloodComponentRepository.findById(issueComponent.getComponentId()).ifPresent(bloodComponent -> {
                bagStockRepository.findById(bloodComponent.getBagStockId()).ifPresent(bagStock -> {
                    String formattedComponentId = String.format("%s (%s %s)",
                            bagStock.getBagNo(),
                            bloodComponent.getVolume(),
                            bloodComponent.getUnit()
                    );

                    dto.setComponentId(formattedComponentId);

                    donorDetailsRepository.findById(bagStock.getDonorId()).ifPresent(donor -> {
                        dto.setDonorName(donor.getDonorName());
                        dto.setDonorGender(donor.getGender());
                    });
                });
            });
            return dto;
        }).collect(Collectors.toList());
    }


}



