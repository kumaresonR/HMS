package com.hms.services.ambulancemanagement.service;


import com.hms.services.ambulancemanagement.configuration.ConnectionInterface;
import com.hms.services.ambulancemanagement.entity.HMS_TM_AddAmbulanceCall;
import com.hms.services.ambulancemanagement.entity.HMS_TM_AddVehicle;
import com.hms.services.ambulancemanagement.entity.HMS_TM_AmbulanceCallTransaction;
import com.hms.services.ambulancemanagement.exception.CustomException;
import com.hms.services.ambulancemanagement.model.*;
import com.hms.services.ambulancemanagement.repository.AddAmbulanceCallRepository;
import com.hms.services.ambulancemanagement.repository.AddVehicleRepository;
import com.hms.services.ambulancemanagement.repository.AmbulanceCallTransactionRepository;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AddAmbulanceCallService {


    private final AddAmbulanceCallRepository ambulanceCallRepository;
    private final AmbulanceCallTransactionRepository transactionRepository;
    private final ModelMapper modelMapper;
    private final AddVehicleRepository vehicleRepository;
    private final ConnectionInterface connectionInterface;

    @Autowired
    public AddAmbulanceCallService(final AddAmbulanceCallRepository ambulanceCallRepository,
                                   final AmbulanceCallTransactionRepository transactionRepository, final ModelMapper modelMapper,
                                   final AddVehicleRepository vehicleRepository,final ConnectionInterface connectionInterface) {
        this.ambulanceCallRepository = ambulanceCallRepository;
        this.transactionRepository = transactionRepository;
        this.modelMapper = modelMapper;
        this.vehicleRepository = vehicleRepository;
        this.connectionInterface = connectionInterface;

    }

    @Transactional
    // Add new Ambulance Call
    public JSONObject addAmbulanceCall(AmbulanceCallDTO ambulanceCall, MultipartFile attachment) throws IOException {
        try {
            HMS_TM_AddAmbulanceCall ambulanceCallEntity = modelMapper.map(ambulanceCall, HMS_TM_AddAmbulanceCall.class);
            ambulanceCallEntity.setActive(true);
            ambulanceCallEntity.setCreatedAt(LocalDateTime.now());
            ambulanceCallEntity.setCreatedBy("createdBy");
            ambulanceCallEntity.setLastModifiedBy("createdBy");
            ambulanceCallEntity.setLastModifiedAt(LocalDateTime.now());
            int randomNumber = ThreadLocalRandom.current().nextInt(1000, 10000);
            ambulanceCallEntity.setBillNo("ACB" + randomNumber);
            if (ambulanceCall.getTransactions().get(0).getPaymentAmount() > ambulanceCall.getNetAmount()) {
                throw new IllegalArgumentException("Payment amount cannot be greater than net amount.");
            }
            ambulanceCallEntity.setBalanceAmount(ambulanceCall.getNetAmount() - ambulanceCall.getTransactions().get(0).getPaymentAmount());
            // Save the main Ambulance Call
            HMS_TM_AddAmbulanceCall savedAmbulanceCall = ambulanceCallRepository.save(ambulanceCallEntity);

            // Save associated transactions if any
            if (ambulanceCall.getTransactions() != null && !ambulanceCall.getTransactions().isEmpty()) {
                for (AmbulanceCallTransactionDTO transactionDTO : ambulanceCall.getTransactions()) {
                    HMS_TM_AmbulanceCallTransaction transactionEntity = modelMapper.map(transactionDTO, HMS_TM_AmbulanceCallTransaction.class);
                    if (attachment != null && !attachment.isEmpty()) {
                        String encodedAttachment = Base64.getEncoder().encodeToString(attachment.getBytes());
                        transactionEntity.setAttachment(encodedAttachment);
                    }
                    transactionEntity.setVehicleChargeId(savedAmbulanceCall.getVehicleChargeId());
                    transactionEntity.setCreatedAt(LocalDateTime.now());
                    transactionEntity.setActive(true);
                    transactionRepository.save(transactionEntity);
                }
            }
            JSONObject obj = new JSONObject();
            obj.put("Message", "Ambulance call with ID: " + savedAmbulanceCall.getVehicleChargeId() + " has been created successfully.");
            return obj;
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    // Get all Ambulance Calls
    public List<AmbulanceCallDTO> getAllAmbulanceWithPayments() {
        List<HMS_TM_AddAmbulanceCall> ambulanceCalls = ambulanceCallRepository.findAllByIsActiveTrueOrderByCreatedAtDesc();
        Type targetListType = new TypeToken<List<AmbulanceCallDTO>>() {}.getType();
        List<AmbulanceCallDTO> ambulanceCallDTOs = modelMapper.map(ambulanceCalls, targetListType);
        for (AmbulanceCallDTO dto : ambulanceCallDTOs) {
            PatientsDTO patients =connectionInterface.getPatientById(dto.getPatientId()).getBody();
            dto.setPatients(patients);
            Optional<HMS_TM_AddVehicle> optionalVehicle = vehicleRepository.findByVehicleIdAndIsActiveTrue(dto.getVehicleId());
            if (optionalVehicle.isPresent()) {
                HMS_TM_AddVehicle vehicle = optionalVehicle.get();
                AddVehicleDTO vehicleDetails = modelMapper.map(vehicle, AddVehicleDTO.class);
                dto.setVehicle(vehicleDetails);
            }
            List<HMS_TM_AmbulanceCallTransaction> transactions =
                    transactionRepository.findByVehicleChargeIdAndIsActiveTrue(dto.getVehicleChargeId());
            Type transactionListType = new TypeToken<List<AmbulanceCallTransactionDTO>>() {}.getType();
            List<AmbulanceCallTransactionDTO> transactionDTOs = modelMapper.map(transactions, transactionListType);
            dto.setTransactions(transactionDTOs);
        }
        return ambulanceCallDTOs;

    }

    // Get Ambulance Call by ID
    public Optional<HMS_TM_AddAmbulanceCall> getAmbulanceCallById(String id) {
        return ambulanceCallRepository.findByVehicleChargeIdAndIsActiveTrue(id);
    }

    @Transactional
    // Update an existing Ambulance Call
    public JSONObject updateAmbulanceCall(String id, AmbulanceCallDTO ambulanceCallDTO, MultipartFile file) throws IOException {
        try {
            Optional<HMS_TM_AddAmbulanceCall> existingAmbulanceCallOpt = Optional.ofNullable(ambulanceCallRepository.findByVehicleChargeIdAndIsActiveTrue(id)
                    .orElseThrow(() -> new CustomException("Ambulance not found with ID: " + id, HttpStatus.BAD_REQUEST)));
            HMS_TM_AddAmbulanceCall existingCall=existingAmbulanceCallOpt.get();
            existingCall.setCaseId(ambulanceCallDTO.getCaseId());
            existingCall.setVehicleId(ambulanceCallDTO.getVehicleId());
            existingCall.setPatientId(ambulanceCallDTO.getPatientId());
            existingCall.setVehicleModel(ambulanceCallDTO.getVehicleModel());
            existingCall.setDriverName(ambulanceCallDTO.getDriverName());
            existingCall.setChargeCategory(ambulanceCallDTO.getChargeCategory());
            existingCall.setChargeName(ambulanceCallDTO.getChargeName());
            existingCall.setStandardCharge(ambulanceCallDTO.getStandardCharge());
            existingCall.setNote(ambulanceCallDTO.getNote());
            existingCall.setTotal(ambulanceCallDTO.getTotal());
            existingCall.setDiscountAmount(ambulanceCallDTO.getDiscountAmount());
            existingCall.setDiscountPercentage(ambulanceCallDTO.getDiscountPercentage());
            existingCall.setTaxAmount(ambulanceCallDTO.getTaxAmount());
            existingCall.setTaxPercentage(ambulanceCallDTO.getTaxPercentage());
            existingCall.setNetAmount(ambulanceCallDTO.getNetAmount());
            existingCall.setBalanceAmount(ambulanceCallDTO.getBalanceAmount());
            existingCall.setGstAdded(ambulanceCallDTO.isGstAdded());
            existingCall.setActive(true);
            existingCall.setLastModifiedBy("createdBy");
            existingCall.setLastModifiedAt(LocalDateTime.now());
            if (ambulanceCallDTO.getTransactions().get(0).getPaymentAmount() > ambulanceCallDTO.getNetAmount()) {
                throw new IllegalArgumentException("Payment amount cannot be greater than net amount.");
            }
            List<HMS_TM_AmbulanceCallTransaction> transactions =
                    transactionRepository.findByVehicleChargeIdAndIsActiveTrue(existingCall.getVehicleChargeId());
            double totalPaymentAmount = transactions.stream()
                    .mapToDouble(HMS_TM_AmbulanceCallTransaction::getPaymentAmount)
                    .sum();
            double total_paidAmount=totalPaymentAmount+ambulanceCallDTO.getTransactions().get(0).getPaymentAmount();
            if (ambulanceCallDTO.getNetAmount() <= total_paidAmount) {
                throw new IllegalArgumentException("Total paid amount: " + totalPaymentAmount+"Balance Amount: " + (ambulanceCallDTO.getNetAmount()-totalPaymentAmount));
            }
            existingCall.setBalanceAmount(existingCall.getNetAmount() - total_paidAmount);
            // Save the main Ambulance Call
            HMS_TM_AddAmbulanceCall savedAmbulanceCall = ambulanceCallRepository.save(existingCall);

            // Save associated transactions if any
            if (ambulanceCallDTO.getTransactions() != null && !ambulanceCallDTO.getTransactions().isEmpty()) {
                for (AmbulanceCallTransactionDTO transactionDTO : ambulanceCallDTO.getTransactions()) {
                    HMS_TM_AmbulanceCallTransaction transactionEntity = modelMapper.map(transactionDTO, HMS_TM_AmbulanceCallTransaction.class);
                    if (file != null && !file.isEmpty()) {
                        String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
                        transactionEntity.setAttachment(encodedAttachment);
                    }
                    transactionEntity.setVehicleChargeId(savedAmbulanceCall.getVehicleChargeId());
                    transactionEntity.setActive(true);
                    transactionRepository.save(transactionEntity);
                }
            }
            JSONObject obj = new JSONObject();
            obj.put("Message", "Ambulance call with ID: " + savedAmbulanceCall.getVehicleChargeId() + " has been updated successfully.");
            return obj;
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    // Delete Ambulance Call by ID
    public JSONObject deleteAmbulanceCall(String id) {
        Optional<HMS_TM_AddAmbulanceCall> existingAmbulanceCallOpt = Optional.ofNullable(ambulanceCallRepository.findByVehicleChargeIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Ambulance not found with ID: " + id, HttpStatus.BAD_REQUEST)));
        existingAmbulanceCallOpt.get().setActive(false);
        ambulanceCallRepository.save(existingAmbulanceCallOpt.get());
        JSONObject obj = new JSONObject();
        obj.put("Message", "Ambulance call with ID: " + id + " has been deleted successfully.");
        return obj;

    }

    public JSONObject addAmbulanceCallPayment(String id, AmbulanceCallTransactionDTO transactionDTO, MultipartFile file) throws IOException {
        try {
            Optional<HMS_TM_AddAmbulanceCall> existingAmbulanceCallOpt = Optional.ofNullable(ambulanceCallRepository.findByVehicleChargeIdAndIsActiveTrue(id)
                    .orElseThrow(() -> new CustomException("Ambulance not found with ID: " + id, HttpStatus.BAD_REQUEST)));
            double balanceAmount = existingAmbulanceCallOpt.get().getBalanceAmount();
            double paymentAmount = transactionDTO.getPaymentAmount();
            if (balanceAmount >= paymentAmount) {
                HMS_TM_AmbulanceCallTransaction transactionEntity = modelMapper.map(transactionDTO, HMS_TM_AmbulanceCallTransaction.class);
                transactionEntity.setVehicleChargeId(id);
                if (file != null && !file.isEmpty()) {
                    String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
                    transactionEntity.setAttachment(encodedAttachment);
                }
                existingAmbulanceCallOpt.get().setBalanceAmount(balanceAmount-paymentAmount);
                transactionEntity.setCreatedAt(LocalDateTime.now());
                transactionEntity.setActive(true);
                ambulanceCallRepository.save(existingAmbulanceCallOpt.get());
                transactionRepository.save(transactionEntity);
            } else {
                throw new IllegalArgumentException("Payment amount exceed the balance amount or payment due not there");
            }
            JSONObject obj = new JSONObject();
            obj.put("Message", "Payment created with ID: " + id + " has been created successfully.");
            return obj;
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public List<HMS_TM_AmbulanceCallTransaction> getAllPaymentById(String id) {
        return transactionRepository.findByVehicleChargeIdAndIsActiveTrue(id);
    }

    public IncomeChanges getAmbulanceIncome() {
        Double todayAmbulanceIncome = transactionRepository.getAmbulanceIncome();
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Double yesterdayAmbulanceIncome = transactionRepository.getYesterdayAmbulanceIncome(yesterday);
        todayAmbulanceIncome = (todayAmbulanceIncome != null) ? todayAmbulanceIncome : 0.0;
        yesterdayAmbulanceIncome = (yesterdayAmbulanceIncome != null) ? yesterdayAmbulanceIncome : 0.0;
        String percentageChange;
        if (yesterdayAmbulanceIncome == 0.0) {
            percentageChange = (todayAmbulanceIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((todayAmbulanceIncome - yesterdayAmbulanceIncome) / yesterdayAmbulanceIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(todayAmbulanceIncome, percentageChange);
    }

    public Double getAmbulanceMonthlyIncome() {
        Double monthlyIncome=transactionRepository.getAmbulanceMonthlyIncome();
        return (monthlyIncome != null) ? monthlyIncome : 0.0;
    }

    public BillSummary getAmbulanceOpdAndIpdPayment(String ipdOrOpdId) {
        return ambulanceCallRepository.findAmbulanceBillSummaryByIpdOrOpdId(ipdOrOpdId)
                .orElse(new BillSummary(ipdOrOpdId, 0.0, 0.0));
    }

    public Integer getMedicalHistoryAmbulance(String patientId) {
        Integer ambulance=ambulanceCallRepository.countByPatientId(patientId);
        return (ambulance != null) ? ambulance : 0;
    }

    public IncomeChanges getAmbulanceIncreaseMonthlyIncome() {
        Double currentMonthAmbulanceIncome = transactionRepository.getMonthlyAmbulanceIncome(LocalDate.now().getMonthValue(), LocalDate.now().getYear());
        Double previousMonthAmbulanceIncome = transactionRepository.getMonthlyAmbulanceIncome(LocalDate.now().minusMonths(1).getMonthValue(), LocalDate.now().minusMonths(1).getYear());
        currentMonthAmbulanceIncome = (currentMonthAmbulanceIncome != null) ? currentMonthAmbulanceIncome : 0.0;
        previousMonthAmbulanceIncome = (previousMonthAmbulanceIncome != null) ? previousMonthAmbulanceIncome : 0.0;
        String percentageChange;
        if (previousMonthAmbulanceIncome == 0.0) {
            percentageChange = (currentMonthAmbulanceIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentMonthAmbulanceIncome - previousMonthAmbulanceIncome) / previousMonthAmbulanceIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentMonthAmbulanceIncome, percentageChange);
    }


    public IncomeChanges getAmbulanceIncreaseYearlyIncome() {
        int currentYear = LocalDate.now().getYear();
        int previousYear = currentYear - 1;
        Double currentYearAmbulanceIncome = transactionRepository.getYearlyAmbulanceIncome(currentYear);
        Double previousYearAmbulanceIncome = transactionRepository.getYearlyAmbulanceIncome(previousYear);
        currentYearAmbulanceIncome = (currentYearAmbulanceIncome != null) ? currentYearAmbulanceIncome : 0.0;
        previousYearAmbulanceIncome = (previousYearAmbulanceIncome != null) ? previousYearAmbulanceIncome : 0.0;
        String percentageChange;
        if (previousYearAmbulanceIncome == 0.0) {
            percentageChange = (currentYearAmbulanceIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentYearAmbulanceIncome - previousYearAmbulanceIncome) / previousYearAmbulanceIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentYearAmbulanceIncome, percentageChange);
    }

    public IncomeChanges getAmbulanceIncreaseWeeklyIncome() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        LocalDate previousWeekDate = LocalDate.now().minusWeeks(1);
        int previousWeek = previousWeekDate.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int previousYear = previousWeekDate.getYear();
        Double currentWeekAmbulanceIncome = transactionRepository.getWeeklyAmbulanceIncome(currentWeek, currentYear);
        Double previousWeekAmbulanceIncome = transactionRepository.getWeeklyAmbulanceIncome(previousWeek, previousYear);
        currentWeekAmbulanceIncome = (currentWeekAmbulanceIncome != null) ? currentWeekAmbulanceIncome : 0.0;
        previousWeekAmbulanceIncome = (previousWeekAmbulanceIncome != null) ? previousWeekAmbulanceIncome : 0.0;
        String percentageChange;
        if (previousWeekAmbulanceIncome == 0.0) {
            percentageChange = (currentWeekAmbulanceIncome > 0) ? "100% increase" : "No change";
        } else {
            double percentage = ((currentWeekAmbulanceIncome - previousWeekAmbulanceIncome) / previousWeekAmbulanceIncome) * 100;
            percentageChange = String.format("%+.2f%%", percentage);
        }
        return new IncomeChanges(currentWeekAmbulanceIncome, percentageChange);
    }
@Transactional
    public List<HMS_TM_AmbulanceCallTransaction> fetchAllAmbulanceIncomeForToday() {
        return transactionRepository.getAllAmbulanceIncomeForToday();
    }
@Transactional
    public List<HMS_TM_AmbulanceCallTransaction> fetchAllAmbulanceIncomeForCurrentMonth() {
        int month = LocalDate.now().getMonthValue();
        int year = LocalDate.now().getYear();
        return transactionRepository.getAllAmbulanceIncomeForMonth(month, year);
    }
@Transactional
    public List<HMS_TM_AmbulanceCallTransaction> fetchAllAmbulanceIncomeForCurrentYear() {
        int year = LocalDate.now().getYear();
        return transactionRepository.getAllAmbulanceIncomeForYear(year);
    }
@Transactional
    public List<HMS_TM_AmbulanceCallTransaction> fetchAllAmbulanceIncomeForCurrentWeek() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        return transactionRepository.getAllAmbulanceIncomeForWeek(currentWeek, currentYear);
    }

    public List<AmbulanceCallDTO> getFilteredAmbulanceCalls(String ipdOrOpdId, String patientId) {
        List<HMS_TM_AddAmbulanceCall> ambulanceCalls = ambulanceCallRepository.findByIsActiveTrueAndIpdOrOpdIdOrPatientIdOrderByCreatedAtDesc(ipdOrOpdId, patientId);
        Type targetListType = new TypeToken<List<AmbulanceCallDTO>>() {}.getType();
        List<AmbulanceCallDTO> ambulanceCallDTOs = modelMapper.map(ambulanceCalls, targetListType);

        for (AmbulanceCallDTO dto : ambulanceCallDTOs) {
            PatientsDTO patients = connectionInterface.getPatientById(dto.getPatientId()).getBody();
            dto.setPatients(patients);

            Optional<HMS_TM_AddVehicle> optionalVehicle = vehicleRepository.findByVehicleIdAndIsActiveTrue(dto.getVehicleId());
            optionalVehicle.ifPresent(vehicle -> dto.setVehicle(modelMapper.map(vehicle, AddVehicleDTO.class)));

            List<HMS_TM_AmbulanceCallTransaction> transactions =
                    transactionRepository.findByVehicleChargeIdAndIsActiveTrue(dto.getVehicleChargeId());
            Type transactionListType = new TypeToken<List<AmbulanceCallTransactionDTO>>() {}.getType();
            List<AmbulanceCallTransactionDTO> transactionDTOs = modelMapper.map(transactions, transactionListType);
            dto.setTransactions(transactionDTOs);
        }
        return ambulanceCallDTOs;
    }


}


