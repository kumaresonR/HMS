package com.hms.services.ipdmanagement.service;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDPayments;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.model.IncomeChanges;
import com.hms.services.ipdmanagement.repository.IPDPaymentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class IPDPaymentsService {

    private final IPDPaymentsRepository ipdPaymentsRepository;

    @Autowired
    public IPDPaymentsService(IPDPaymentsRepository ipdPaymentsRepository) {
        this.ipdPaymentsRepository = ipdPaymentsRepository;
    }

    public HMS_TM_IPDPayments createIPDPayment(HMS_TM_IPDPayments payment, MultipartFile file) {
        try {
            int randomNumber = ThreadLocalRandom.current().nextInt(1000, 10000);
            payment.setCreatedAt(LocalDateTime.now());
            payment.setTransactionId("TRANID" + randomNumber);
            payment.setActive(true);
            if (file != null && !file.isEmpty()) {
                String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
                payment.setChequeAttachment(encodedAttachment);
            }
            return ipdPaymentsRepository.save(payment);
        } catch (Exception ex) {
            throw new CustomException("Failed to create payment: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public HMS_TM_IPDPayments getIPDPaymentById(String ipdChargeId) {
        return ipdPaymentsRepository.findByIpdPaymentIdAndIsActiveTrue(ipdChargeId)
                .orElseThrow(() -> new CustomException("Payment with ID " + ipdChargeId + " not found", HttpStatus.NOT_FOUND));
    }


    public List<HMS_TM_IPDPayments> getIPDPaymentsByIpdId(String ipdId) {
        return Optional.ofNullable(ipdPaymentsRepository.findByIpdIdAndIsActiveTrue(ipdId))
                .filter(list -> !list.isEmpty())
                .orElse(Collections.emptyList());
    }


    public HMS_TM_IPDPayments updateIPDPayment(String ipdChargeId, HMS_TM_IPDPayments updatedPayment, MultipartFile file) throws IOException {
        HMS_TM_IPDPayments existingPayment = ipdPaymentsRepository.findByIpdPaymentIdAndIsActiveTrue(ipdChargeId)
                .orElseThrow(() -> new CustomException("Payment with IPD Charge ID " + ipdChargeId + " not found", HttpStatus.NOT_FOUND));

        existingPayment.setTransactionId(updatedPayment.getTransactionId());
        existingPayment.setAmount(updatedPayment.getAmount());
        existingPayment.setPaymentMode(updatedPayment.getPaymentMode());
        existingPayment.setNote(updatedPayment.getNote());
        existingPayment.setLastModifiedAt(LocalDateTime.now());
        if(updatedPayment.getPaymentMode().equalsIgnoreCase("Cheque")){
            if (file != null && !file.isEmpty()) {
                String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
                existingPayment.setChequeAttachment(encodedAttachment);
            }
            existingPayment.setChequeDate(updatedPayment.getChequeDate());
            existingPayment.setChequeNo(updatedPayment.getChequeNo());

        }
        try {
            return ipdPaymentsRepository.save(existingPayment);
        } catch (Exception ex) {
            throw new CustomException("Failed to update payment: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    public void deleteIPDPayment(String ipdChargeId) {
        HMS_TM_IPDPayments payment = ipdPaymentsRepository.findByIpdPaymentIdAndIsActiveTrue(ipdChargeId)
                .orElseThrow(() -> new CustomException("Payment not found with ID: " + ipdChargeId, HttpStatus.BAD_REQUEST));
        payment.setActive(false);
        payment.setLastModifiedBy("modifiedBy");
        payment.setLastModifiedAt(LocalDateTime.now());
        ipdPaymentsRepository.save(payment);
    }


    public IncomeChanges getIPDIncome() {
        Double todayIncome  = ipdPaymentsRepository.getTotalIPDIncome();
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Double yesterdayIncome = ipdPaymentsRepository.getYesterdayIPDIncome(yesterday);
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

    public Double getIPDMonthlyIncome() {
        Double monthlyIncome=ipdPaymentsRepository.getTotalMonthlyIPDIncome();
        return (monthlyIncome != null) ? monthlyIncome : 0.0;
    }


    public IncomeChanges getIPDIncreaseMonthlyIncome() {
        Double currentMonthIncome = ipdPaymentsRepository.getTotalIPDIncomeForMonth(LocalDate.now().getMonthValue(), LocalDate.now().getYear());
        LocalDate previousMonth = LocalDate.now().minusMonths(1);
        Double previousMonthIncome = ipdPaymentsRepository.getTotalIPDIncomeForMonth(previousMonth.getMonthValue(), previousMonth.getYear());
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

    public IncomeChanges getIPDIncreaseYearlyIncome() {
        int currentYear = LocalDate.now().getYear();
        int previousYear = currentYear - 1;
        Double currentYearIncome = ipdPaymentsRepository.getTotalIPDIncomeForYear(currentYear);
        Double previousYearIncome = ipdPaymentsRepository.getTotalIPDIncomeForYear(previousYear);
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

    public IncomeChanges getIPDIncreaseWeeklyIncome() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        LocalDate previousWeekDate = LocalDate.now().minusWeeks(1);
        int previousWeek = previousWeekDate.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int previousYear = previousWeekDate.getYear();
        Double currentWeekIncome = ipdPaymentsRepository.getTotalIPDIncomeForWeek(currentWeek, currentYear);
        Double previousWeekIncome = ipdPaymentsRepository.getTotalIPDIncomeForWeek(previousWeek, previousYear);
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

    public List<HMS_TM_IPDPayments> fetchAllIPDIncomeForToday() {
        return ipdPaymentsRepository.getAllIPDIncomeForToday();
    }

    public List<HMS_TM_IPDPayments> fetchAllIPDIncomeForCurrentMonth() {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        return ipdPaymentsRepository.getAllIPDIncomeForMonth(currentMonth, currentYear);
    }

    public List<HMS_TM_IPDPayments> fetchAllIPDIncomeForCurrentWeek() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        return ipdPaymentsRepository.getAllIPDIncomeForWeek(currentWeek, currentYear);
    }

    public List<HMS_TM_IPDPayments> fetchAllIPDIncomeForCurrentYear() {
        int currentYear = LocalDate.now().getYear();
        return ipdPaymentsRepository.getAllIPDIncomeForYear(currentYear);
    }
}

