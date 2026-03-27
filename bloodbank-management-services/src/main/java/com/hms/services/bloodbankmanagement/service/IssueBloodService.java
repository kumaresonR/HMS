package com.hms.services.bloodbankmanagement.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.bloodbankmanagement.configuration.PatientManagementInterface;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_BagStock;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_DonorDetails;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_IssueBlood;
import com.hms.services.bloodbankmanagement.model.BillSummary;
import com.hms.services.bloodbankmanagement.model.IncomeChanges;
import com.hms.services.bloodbankmanagement.model.BagStocksDTO;
import com.hms.services.bloodbankmanagement.model.IssueBloodDTO;
import com.hms.services.bloodbankmanagement.model.PatientsDTO;
import com.hms.services.bloodbankmanagement.repository.BagStockRepository;
import com.hms.services.bloodbankmanagement.repository.DonorDetailsRepository;
import com.hms.services.bloodbankmanagement.repository.IssueBloodRepository;
import com.hms.services.bloodbankmanagement.repository.IssueComponentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IssueBloodService {

    @Autowired
    private IssueBloodRepository issueBloodRepository;
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


    public HMS_TM_IssueBlood generateIssueBlood(String bloodDataJson, MultipartFile attachmentFile) throws IOException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_IssueBlood issueBlood = objectMapper.readValue(bloodDataJson, HMS_TM_IssueBlood.class);
        issueBlood.setCreatedAt(LocalDateTime.now());
        String maxId = issueBloodRepository.findMaxIssueBloodId();
        int nextId = (maxId == null) ? 1 : Integer.parseInt(maxId.substring(5)) + 1;
        String generatedId = "BIB" + String.format("%04d", nextId);
        issueBlood.setIssueBloodId(generatedId);

        double total = issueBlood.getTotal() != null ? issueBlood.getTotal() : 0.0;
        double paymentAmount = issueBlood.getPaymentAmount() != null ? issueBlood.getPaymentAmount() : 0.0;
        double balanceAmount = total - paymentAmount;
        issueBlood.setBalanceAmount(balanceAmount > 0 ? balanceAmount : 0.0);

        if (attachmentFile != null) {
            byte[] fileBytes = attachmentFile.getBytes();
            String encodedFile = Base64.getEncoder().encodeToString(fileBytes);
            issueBlood.setAttachDocument(encodedFile);
        }

        return issueBloodRepository.save(issueBlood);
    }

//    @Transactional
//    public List<IssueBloodDTO> getAllIssueBloodDetails() {
//        List<HMS_TM_IssueBlood> issueBloodRecords = issueBloodRepository.findAllByDeletedFalse();
//
//        List<IssueBloodDTO> dtoList = new ArrayList<>();
//        for (HMS_TM_IssueBlood issueBlood : issueBloodRecords) {
//            IssueBloodDTO dto = new IssueBloodDTO();
//            dto.setIssueBloodId(issueBlood.getIssueBloodId());
//            dto.setPatientId(issueBlood.getPatientId());
//            dto.setIpdOrOpdId(issueBlood.getIpdOrOpdId());
//            dto.setCaseId(issueBlood.getCaseId());
//            dto.setIssueDate(issueBlood.getIssueDate());
//            dto.setHospitalDoctor(issueBlood.getHospitalDoctor());
//            dto.setReferenceName(issueBlood.getReferenceName());
//            dto.setTechnician(issueBlood.getTechnician());
//            dto.setBloodGroup(issueBlood.getBloodGroup());
//            dto.setBagStockId(issueBlood.getBagStockId());
//            dto.setChargeCategory(issueBlood.getChargeCategory());
//            dto.setChargeName(issueBlood.getChargeName());
//            dto.setStandardCharge(issueBlood.getStandardCharge());
//            dto.setNote(issueBlood.getNote());
//            dto.setBloodQty(issueBlood.getBloodQty());
//            dto.setTotal(issueBlood.getTotal());
//            dto.setDiscount(issueBlood.getDiscount());
//            dto.setTax(issueBlood.getTax());
//            dto.setNetAmount(issueBlood.getNetAmount());
//            dto.setPaymentMode(issueBlood.getPaymentMode());
//            dto.setPaymentAmount(issueBlood.getPaymentAmount());
//            dto.setBalanceAmount(issueBlood.getBalanceAmount());
//            dto.setChequeNo(issueBlood.getChequeNo());
//            dto.setChequeDate(issueBlood.getChequeDate());
//            dto.setAttachDocument(issueBlood.getAttachDocument());
//            dto.setDeleted(issueBlood.getDeleted());
//
//            ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(issueBlood.getPatientId());
//            PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
//            dto.setPatientDetails(patientDetails);
//
//            dtoList.add(dto);
//        }
//        return dtoList;
//    }

//    @Transactional
//    public IssueBloodDTO getIssueBloodDetails(String issueBloodId) {
//        HMS_TM_IssueBlood issueBlood = issueBloodRepository.findByIssueBloodIdAndDeletedFalse(issueBloodId)
//                .orElseThrow(() -> new RuntimeException("Issue blood record not found with ID: " + issueBloodId));
//
//        IssueBloodDTO dto = new IssueBloodDTO();
//        dto.setIssueBloodId(issueBlood.getIssueBloodId());
//        dto.setPatientId(issueBlood.getPatientId());
//        dto.setIpdOrOpdId(issueBlood.getIpdOrOpdId());
//        dto.setCaseId(issueBlood.getCaseId());
//        dto.setIssueDate(issueBlood.getIssueDate());
//        dto.setHospitalDoctor(issueBlood.getHospitalDoctor());
//        dto.setReferenceName(issueBlood.getReferenceName());
//        dto.setTechnician(issueBlood.getTechnician());
//        dto.setBloodGroup(issueBlood.getBloodGroup());
//        dto.setBag(issueBlood.getBagStockId());
//        dto.setChargeCategory(issueBlood.getChargeCategory());
//        dto.setChargeName(issueBlood.getChargeName());
//        dto.setStandardCharge(issueBlood.getStandardCharge());
//        dto.setNote(issueBlood.getNote());
//        dto.setBloodQty(issueBlood.getBloodQty());
//        dto.setTotal(issueBlood.getTotal());
//        dto.setDiscount(issueBlood.getDiscount());
//        dto.setTax(issueBlood.getTax());
//        dto.setNetAmount(issueBlood.getNetAmount());
//        dto.setPaymentMode(issueBlood.getPaymentMode());
//        dto.setPaymentAmount(issueBlood.getPaymentAmount());
//        dto.setBalanceAmount(issueBlood.getBalanceAmount());
//        dto.setChequeNo(issueBlood.getChequeNo());
//        dto.setChequeDate(issueBlood.getChequeDate());
//        dto.setAttachDocument(issueBlood.getAttachDocument());
//        dto.setDeleted(issueBlood.getDeleted());
//
//        ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(issueBlood.getPatientId());
//        PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
//        dto.setPatientDetails(patientDetails);
//
//        return dto;
//    }

    @Transactional
    public List<IssueBloodDTO> getAllIssueBloodDetails() {
        List<HMS_TM_IssueBlood> issueBloodRecords = issueBloodRepository.findAllByDeletedFalse();

        List<IssueBloodDTO> dtoList = new ArrayList<>();
        for (HMS_TM_IssueBlood issueBlood : issueBloodRecords) {
            IssueBloodDTO dto = new IssueBloodDTO();
            dto.setIssueBloodId(issueBlood.getIssueBloodId());
            dto.setPatientId(issueBlood.getPatientId());
            dto.setIpdOrOpdId(issueBlood.getIpdOrOpdId());
            dto.setCaseId(issueBlood.getCaseId());
            dto.setIssueDate(issueBlood.getIssueDate());
            dto.setHospitalDoctor(issueBlood.getHospitalDoctor());
            dto.setReferenceName(issueBlood.getReferenceName());
            dto.setTechnician(issueBlood.getTechnician());
            dto.setBloodGroup(issueBlood.getBloodGroup());

            Optional<HMS_TM_BagStock> bagStockOpt = bagStockRepository.findById(issueBlood.getBagStockId());
            if (bagStockOpt.isPresent()) {
                HMS_TM_BagStock bagStock = bagStockOpt.get();
                String bagStockDetails = String.format("%s|%s|%s", bagStock.getBagNo(), bagStock.getVolume(), bagStock.getUnitType());
                dto.setBagStockId(bagStockDetails);
            }

            dto.setChargeCategory(issueBlood.getChargeCategory());
            dto.setChargeName(issueBlood.getChargeName());
            dto.setStandardCharge(issueBlood.getStandardCharge());
            dto.setNote(issueBlood.getNote());
            dto.setBloodQty(issueBlood.getBloodQty());
            dto.setTotal(issueBlood.getTotal());
            dto.setDiscount(issueBlood.getDiscount());
            dto.setTax(issueBlood.getTax());
            dto.setNetAmount(issueBlood.getNetAmount());
            dto.setPaymentMode(issueBlood.getPaymentMode());
            dto.setPaymentAmount(issueBlood.getPaymentAmount());
            dto.setBalanceAmount(issueBlood.getBalanceAmount());
            dto.setChequeNo(issueBlood.getChequeNo());
            dto.setChequeDate(issueBlood.getChequeDate());
            dto.setAttachDocument(issueBlood.getAttachDocument());
            dto.setDeleted(issueBlood.getDeleted());
            dto.setGstAdded(issueBlood.isGstAdded());

            ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(issueBlood.getPatientId());
            PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
            dto.setPatientDetails(patientDetails);

            if (bagStockOpt.isPresent()) {
                HMS_TM_BagStock bagStock = bagStockOpt.get();
                Optional<HMS_TM_DonorDetails> donorOpt = donorDetailsRepository.findById(bagStock.getDonorId());
                if (donorOpt.isPresent()) {
                    HMS_TM_DonorDetails donor = donorOpt.get();
                    dto.setDonorName(donor.getDonorName());
                    dto.setDonorGender(donor.getGender());
                }
            }

            dtoList.add(dto);
        }
        return dtoList;
    }

    @Transactional
    public IssueBloodDTO getIssueBloodDetails(String issueBloodId) {
        HMS_TM_IssueBlood issueBlood = issueBloodRepository.findByIssueBloodIdAndDeletedFalse(issueBloodId)
                .orElseThrow(() -> new RuntimeException("Issue blood record not found with ID: " + issueBloodId));

        IssueBloodDTO dto = new IssueBloodDTO();
        dto.setIssueBloodId(issueBlood.getIssueBloodId());
        dto.setPatientId(issueBlood.getPatientId());
        dto.setIpdOrOpdId(issueBlood.getIpdOrOpdId());
        dto.setCaseId(issueBlood.getCaseId());
        dto.setIssueDate(issueBlood.getIssueDate());
        dto.setHospitalDoctor(issueBlood.getHospitalDoctor());
        dto.setReferenceName(issueBlood.getReferenceName());
        dto.setTechnician(issueBlood.getTechnician());
        dto.setBloodGroup(issueBlood.getBloodGroup());
        dto.setChargeCategory(issueBlood.getChargeCategory());
        dto.setChargeName(issueBlood.getChargeName());
        dto.setStandardCharge(issueBlood.getStandardCharge());
        dto.setNote(issueBlood.getNote());
        dto.setBloodQty(issueBlood.getBloodQty());
        dto.setTotal(issueBlood.getTotal());
        dto.setDiscount(issueBlood.getDiscount());
        dto.setTax(issueBlood.getTax());
        dto.setNetAmount(issueBlood.getNetAmount());
        dto.setPaymentMode(issueBlood.getPaymentMode());
        dto.setPaymentAmount(issueBlood.getPaymentAmount());
        dto.setBalanceAmount(issueBlood.getBalanceAmount());
        dto.setChequeNo(issueBlood.getChequeNo());
        dto.setChequeDate(issueBlood.getChequeDate());
        dto.setAttachDocument(issueBlood.getAttachDocument());
        dto.setDeleted(issueBlood.getDeleted());
        dto.setGstAdded(issueBlood.isGstAdded());

        ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(issueBlood.getPatientId());
        PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
        dto.setPatientDetails(patientDetails);

        Optional<HMS_TM_BagStock> bagStockOpt = bagStockRepository.findById(issueBlood.getBagStockId());
        if (bagStockOpt.isPresent()) {
            HMS_TM_BagStock bagStock = bagStockOpt.get();

            BagStocksDTO bagStocksDTO = new BagStocksDTO();
            bagStocksDTO.setBagStockId(bagStock.getBagStockId());
            bagStocksDTO.setBagNo(bagStock.getBagNo());
            bagStocksDTO.setVolume(bagStock.getVolume());
            bagStocksDTO.setUnitType(bagStock.getUnitType());

            dto.setBagStocks(bagStocksDTO);

            Optional<HMS_TM_DonorDetails> donorOpt = donorDetailsRepository.findById(bagStock.getDonorId());
            if (donorOpt.isPresent()) {
                HMS_TM_DonorDetails donor = donorOpt.get();
                dto.setDonorName(donor.getDonorName());
                dto.setDonorGender(donor.getGender());
            }
        }

        return dto;
    }

    public HMS_TM_IssueBlood updateIssueBlood(String id, String bloodDataJson, MultipartFile attachmentFile) throws IOException, IOException {
        if (!issueBloodRepository.existsById(id)) {
            throw new EntityNotFoundException("Issue Blood with ID " + id + " not found.");
        }
        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_IssueBlood issueBlood = objectMapper.readValue(bloodDataJson, HMS_TM_IssueBlood.class);

        HMS_TM_IssueBlood existingIssueBlood = issueBloodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Issue Blood with ID " + id + " not found."));

        issueBlood.setIssueBloodId(id);

        Double previousPaymentAmount = existingIssueBlood.getPaymentAmount() != null ? existingIssueBlood.getPaymentAmount() : 0.0;
        Double balanceAmount = existingIssueBlood.getTotal() != null ? existingIssueBlood.getTotal() - previousPaymentAmount : 0.0;

        Double newPaymentAmount = issueBlood.getPaymentAmount();
        if (newPaymentAmount != null && newPaymentAmount > 0) {
            issueBlood.setPaymentAmount(previousPaymentAmount + newPaymentAmount);
            balanceAmount -= newPaymentAmount;
        } else {
            issueBlood.setPaymentAmount(previousPaymentAmount);
        }

        issueBlood.setBalanceAmount(balanceAmount > 0 ? balanceAmount : 0.0);

        if (attachmentFile != null) {
            byte[] fileBytes = attachmentFile.getBytes();
            String encodedFile = Base64.getEncoder().encodeToString(fileBytes);
            issueBlood.setAttachDocument(encodedFile);
        } else {
            issueBlood.setAttachDocument(existingIssueBlood.getAttachDocument());
        }

        return issueBloodRepository.save(issueBlood);
    }

    public HMS_TM_IssueBlood softDeleteIssueBlood(String id) {
        Optional<HMS_TM_IssueBlood> existingIssueBloodOpt = issueBloodRepository.findById(id);

        if (existingIssueBloodOpt.isPresent()) {
            HMS_TM_IssueBlood existingIssueBlood = existingIssueBloodOpt.get();
            existingIssueBlood.setDeleted(true);
            return issueBloodRepository.save(existingIssueBlood);
        } else {
            throw new RuntimeException("Issue Blood not found with ID: " + id);
        }
    }

    public IncomeChanges getIssueBloodIncome() {
        Double todayBloodIncome = issueBloodRepository.getTotalIssueBloodIncome();
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Double yesterdayBloodIncome = issueBloodRepository.getYesterdayIssueBloodIncome(yesterday);
        Double todayComponentIncome =issueComponentRepository.getTotalIssueComponentIncome();
        Double yesterdayComponentIncome =issueComponentRepository.getYesterdayIssueComponentIncome(yesterday);
        Double todayTotalIncome = (todayBloodIncome != null ? todayBloodIncome : 0.0) + (todayComponentIncome != null ? todayComponentIncome : 0.0);
        Double yesterdayTotalIncome = (yesterdayBloodIncome != null ? yesterdayBloodIncome : 0.0) +(yesterdayComponentIncome != null ? yesterdayComponentIncome : 0.0);
        String percentageChange;
        if (yesterdayTotalIncome == 0.0) {
            percentageChange = (todayTotalIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((todayTotalIncome - yesterdayTotalIncome) / yesterdayTotalIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(todayTotalIncome, percentageChange);
    }

    public Double getIssueBloodMonthlyIncome() {
        Double issueBlood=issueBloodRepository.getMonthlyIssueBloodIncome();
        Double componentIncome =issueComponentRepository.getMonthlyIssueComponentIncome();
        issueBlood = (issueBlood != null) ? issueBlood : 0.0;
        componentIncome = (componentIncome != null) ? componentIncome : 0.0;
        return issueBlood + componentIncome;
    }

    public BillSummary getIssueBloodOpdAndIpdPayment(String ipdOrOpdId) {
        BillSummary issueBlood =issueBloodRepository.getIssueBloodOpdAndIpdPayment(ipdOrOpdId)
                .orElse(new BillSummary(ipdOrOpdId, 0.0, 0.0));
        BillSummary issueComponent=issueComponentRepository.getIssueComponentOpdAndIpdPayment(ipdOrOpdId)
                .orElse(new BillSummary(ipdOrOpdId, 0.0, 0.0));
        Double combinedNetAmount = issueBlood.getTotalNetAmount() + issueComponent.getTotalNetAmount();
        Double combinedPaymentAmount = issueBlood.getTotalPaymentAmount() + issueComponent.getTotalPaymentAmount();
        return new BillSummary(ipdOrOpdId, combinedNetAmount, combinedPaymentAmount);

    }

    public Integer getMedicalHistoryBloodBank(String patientId) {
        Integer issueBlood=issueBloodRepository.countByPatientId(patientId);
        Integer blood=(issueBlood != null) ? issueBlood : 0;
        Integer componentIssue=issueComponentRepository.countByPatientId(patientId);
        Integer component=(componentIssue != null) ? componentIssue : 0;
        return blood+component;
    }

    public IncomeChanges getBloodBankIncreaseMonthlyIncome() {
        Double currentMonthBloodIncome = issueBloodRepository.getTotalIssueBloodIncomeForMonth(LocalDate.now().getMonthValue(), LocalDate.now().getYear());
        Double previousMonthBloodIncome = issueBloodRepository.getTotalIssueBloodIncomeForMonth(LocalDate.now().minusMonths(1).getMonthValue(), LocalDate.now().minusMonths(1).getYear());
        Double currentMonthComponentIncome = issueComponentRepository.getTotalIssueComponentIncomeForMonth(LocalDate.now().getMonthValue(), LocalDate.now().getYear());
        Double previousMonthComponentIncome = issueComponentRepository.getTotalIssueComponentIncomeForMonth(LocalDate.now().minusMonths(1).getMonthValue(), LocalDate.now().minusMonths(1).getYear());
        Double currentMonthTotalIncome = (currentMonthBloodIncome != null ? currentMonthBloodIncome : 0.0) +
                (currentMonthComponentIncome != null ? currentMonthComponentIncome : 0.0);
        Double previousMonthTotalIncome = (previousMonthBloodIncome != null ? previousMonthBloodIncome : 0.0) +
                (previousMonthComponentIncome != null ? previousMonthComponentIncome : 0.0);
        String percentageChange;
        if (previousMonthTotalIncome == 0.0) {
            percentageChange = (currentMonthTotalIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentMonthTotalIncome - previousMonthTotalIncome) / previousMonthTotalIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentMonthTotalIncome, percentageChange);
    }

    @Transactional
    public List<HMS_TM_IssueBlood> getIssueBloodByIpdOrOpdId(String ipdOrOpdId) {
        return issueBloodRepository.findByIpdOrOpdIdAndDeletedFalse(ipdOrOpdId);
    }

    public IncomeChanges getBloodBankIncreaseYearlyIncome() {
        int currentYear = LocalDate.now().getYear();
        int previousYear = currentYear - 1;
        Double currentYearBloodIncome = issueBloodRepository.getTotalIssueBloodIncomeForYear(currentYear);
        Double previousYearBloodIncome = issueBloodRepository.getTotalIssueBloodIncomeForYear(previousYear);
        Double currentYearComponentIncome = issueComponentRepository.getTotalIssueComponentIncomeForYear(currentYear);
        Double previousYearComponentIncome = issueComponentRepository.getTotalIssueComponentIncomeForYear(previousYear);
        Double currentYearTotalIncome = (currentYearBloodIncome != null ? currentYearBloodIncome : 0.0) +
                (currentYearComponentIncome != null ? currentYearComponentIncome : 0.0);
        Double previousYearTotalIncome = (previousYearBloodIncome != null ? previousYearBloodIncome : 0.0) +
                (previousYearComponentIncome != null ? previousYearComponentIncome : 0.0);
        String percentageChange;
        if (previousYearTotalIncome == 0.0) {
            percentageChange = (currentYearTotalIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentYearTotalIncome - previousYearTotalIncome) / previousYearTotalIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentYearTotalIncome, percentageChange);
    }


    public IncomeChanges getBloodBankIncreaseWeeklyIncome() {
        LocalDate now = LocalDate.now();
        LocalDate startOfCurrentWeek = now.with(DayOfWeek.MONDAY);
        LocalDate startOfPreviousWeek = startOfCurrentWeek.minusWeeks(1);
        java.sql.Date startOfCurrentWeekSql = java.sql.Date.valueOf(startOfCurrentWeek);
        java.sql.Date nowSql = java.sql.Date.valueOf(now);
        java.sql.Date startOfPreviousWeekSql = java.sql.Date.valueOf(startOfPreviousWeek);
        java.sql.Date startOfPreviousWeekEndSql = java.sql.Date.valueOf(startOfCurrentWeek.minusDays(1));
        Double currentWeekBloodIncome = issueBloodRepository.getTotalIssueBloodIncomeForWeek(startOfCurrentWeekSql, nowSql);
        Double previousWeekBloodIncome = issueBloodRepository.getTotalIssueBloodIncomeForWeek(startOfPreviousWeekSql, startOfPreviousWeekEndSql);

        Double currentWeekComponentIncome = issueComponentRepository.getTotalIssueComponentIncomeForWeek(startOfCurrentWeekSql, nowSql);
        Double previousWeekComponentIncome = issueComponentRepository.getTotalIssueComponentIncomeForWeek(startOfPreviousWeekSql, startOfPreviousWeekEndSql);
        Double currentWeekTotalIncome = (currentWeekBloodIncome != null ? currentWeekBloodIncome : 0.0) +
                (currentWeekComponentIncome != null ? currentWeekComponentIncome : 0.0);
        Double previousWeekTotalIncome = (previousWeekBloodIncome != null ? previousWeekBloodIncome : 0.0) +
                (previousWeekComponentIncome != null ? previousWeekComponentIncome : 0.0);
        String percentageChange;
        if (previousWeekTotalIncome == 0.0) {
            percentageChange = (currentWeekTotalIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentWeekTotalIncome - previousWeekTotalIncome) / previousWeekTotalIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentWeekTotalIncome, percentageChange);
    }
@Transactional
    public List<HMS_TM_IssueBlood> fetchAllIssueBloodIncomeForToday() {
        return issueBloodRepository.getAllIssueBloodIncomeForToday();
    }
@Transactional
    public List<HMS_TM_IssueBlood> fetchAllIssueBloodIncomeForMonth() {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        return issueBloodRepository.getAllIssueBloodIncomeForMonth(currentMonth, currentYear);
    }
@Transactional
    public List<HMS_TM_IssueBlood> fetchAllIssueBloodIncomeForYear() {
        int currentYear = LocalDate.now().getYear();
        return issueBloodRepository.getAllIssueBloodIncomeForYear(currentYear);
    }
@Transactional
    public List<HMS_TM_IssueBlood> fetchAllIssueBloodIncomeForWeek() {
        LocalDate now = LocalDate.now();
        LocalDate startOfCurrentWeek = now.with(DayOfWeek.MONDAY);
        java.sql.Date startOfWeekSql = java.sql.Date.valueOf(startOfCurrentWeek);
        java.sql.Date endOfWeekSql = java.sql.Date.valueOf(now);
        return issueBloodRepository.getAllIssueBloodIncomeForWeek(startOfWeekSql, endOfWeekSql);
    }

    @Transactional
    public List<IssueBloodDTO> getFilteredIssueBloodDetails(String patientId, String ipdOrOpdId) {
        List<HMS_TM_IssueBlood> issueBloodRecords;

        if (patientId != null && !patientId.isEmpty()) {
            issueBloodRecords = issueBloodRepository.findByPatientIdAndDeletedFalse(patientId);
        } else if (ipdOrOpdId != null && !ipdOrOpdId.isEmpty()) {
            issueBloodRecords = issueBloodRepository.findByIpdOrOpdIdAndDeletedFalse(ipdOrOpdId);
        } else {
            issueBloodRecords = issueBloodRepository.findAllByDeletedFalse();
        }

        return issueBloodRecords.stream().map(issueBlood -> {
            IssueBloodDTO dto = new IssueBloodDTO();
            dto.setIssueBloodId(issueBlood.getIssueBloodId());
            dto.setPatientId(issueBlood.getPatientId());
            dto.setIpdOrOpdId(issueBlood.getIpdOrOpdId());
            dto.setCaseId(issueBlood.getCaseId());
            dto.setIssueDate(issueBlood.getIssueDate());
            dto.setHospitalDoctor(issueBlood.getHospitalDoctor());
            dto.setReferenceName(issueBlood.getReferenceName());
            dto.setTechnician(issueBlood.getTechnician());
            dto.setBloodGroup(issueBlood.getBloodGroup());

            Optional<HMS_TM_BagStock> bagStockOpt = bagStockRepository.findById(issueBlood.getBagStockId());
            bagStockOpt.ifPresent(bagStock -> {
                String bagStockDetails = String.format("%s|%s|%s", bagStock.getBagNo(), bagStock.getVolume(), bagStock.getUnitType());
                dto.setBagStockId(bagStockDetails);
            });

            dto.setChargeCategory(issueBlood.getChargeCategory());
            dto.setChargeName(issueBlood.getChargeName());
            dto.setStandardCharge(issueBlood.getStandardCharge());
            dto.setNote(issueBlood.getNote());
            dto.setBloodQty(issueBlood.getBloodQty());
            dto.setTotal(issueBlood.getTotal());
            dto.setDiscount(issueBlood.getDiscount());
            dto.setTax(issueBlood.getTax());
            dto.setNetAmount(issueBlood.getNetAmount());
            dto.setPaymentMode(issueBlood.getPaymentMode());
            dto.setPaymentAmount(issueBlood.getPaymentAmount());
            dto.setBalanceAmount(issueBlood.getBalanceAmount());
            dto.setChequeNo(issueBlood.getChequeNo());
            dto.setChequeDate(issueBlood.getChequeDate());
            dto.setAttachDocument(issueBlood.getAttachDocument());
            dto.setDeleted(issueBlood.getDeleted());
            dto.setGstAdded(issueBlood.isGstAdded());

            ResponseEntity<PatientsDTO> response = patientManagementInterface.getPatientById(issueBlood.getPatientId());
            PatientsDTO patientDetails = modelMapper.map(response.getBody(), PatientsDTO.class);
            dto.setPatientDetails(patientDetails);

            bagStockOpt.ifPresent(bagStock -> {
                Optional<HMS_TM_DonorDetails> donorOpt = donorDetailsRepository.findById(bagStock.getDonorId());
                donorOpt.ifPresent(donor -> {
                    dto.setDonorName(donor.getDonorName());
                    dto.setDonorGender(donor.getGender());
                });
            });

            return dto;
        }).collect(Collectors.toList());
    }
}


