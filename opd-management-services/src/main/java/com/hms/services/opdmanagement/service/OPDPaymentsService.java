package com.hms.services.opdmanagement.service;



import com.hms.services.opdmanagement.entity.HMS_TM_OPDPayments;
import com.hms.services.opdmanagement.exception.CustomException;
import com.hms.services.opdmanagement.model.IncomeChanges;
import com.hms.services.opdmanagement.repository.OPDPaymentsRepository;
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
public class OPDPaymentsService {

    private final OPDPaymentsRepository opdPaymentsRepository;

    @Autowired
    public OPDPaymentsService(OPDPaymentsRepository opdPaymentsRepository) {
        this.opdPaymentsRepository = opdPaymentsRepository;
    }

    public HMS_TM_OPDPayments createOPDPayment(HMS_TM_OPDPayments payment, MultipartFile file) {
        try {
            payment.setCreatedAt(LocalDateTime.now());
            payment.setActive(true);
            int randomNumber = ThreadLocalRandom.current().nextInt(1000, 10000);
            payment.setTransactionId("TRANID" + randomNumber);
            if (file != null && !file.isEmpty()) {
                String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
                payment.setChequeAttachment(encodedAttachment);
            }
            return opdPaymentsRepository.save(payment);
        } catch (Exception ex) {
            throw new CustomException("Failed to create payment: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public HMS_TM_OPDPayments getOPDPaymentById(String ipdChargeId) {
        return opdPaymentsRepository.findByOpdChargeIdAndIsActiveTrue(ipdChargeId)
                .orElseThrow(() -> new CustomException("Payment with ID " + ipdChargeId + " not found", HttpStatus.NOT_FOUND));
    }


    public List<HMS_TM_OPDPayments> getOPDPaymentsByOpdId(String ipdId) {
        return Optional.ofNullable(opdPaymentsRepository.findByOpdIdAndIsActiveTrue(ipdId))
                .filter(list -> !list.isEmpty())
                .orElse(Collections.emptyList());
    }


    public HMS_TM_OPDPayments updateOPDPayment(String opdChargeId, HMS_TM_OPDPayments updatedPayment,MultipartFile file) throws IOException {
        HMS_TM_OPDPayments existingPayment = opdPaymentsRepository.findByOpdChargeIdAndIsActiveTrue(opdChargeId)
                .orElseThrow(() -> new CustomException("Payment with IPD Charge ID " + opdChargeId + " not found", HttpStatus.NOT_FOUND));

        existingPayment.setTransactionId(updatedPayment.getTransactionId());
        existingPayment.setAmount(updatedPayment.getAmount());
        existingPayment.setPaymentMode(updatedPayment.getPaymentMode());
        existingPayment.setChequeDate(updatedPayment.getChequeDate());
        existingPayment.setChequeNo(updatedPayment.getChequeNo());
        existingPayment.setChequeAttachment(updatedPayment.getChequeAttachment());
        existingPayment.setNote(updatedPayment.getNote());
        existingPayment.setLastModifiedAt(LocalDateTime.now());
        if (file != null && !file.isEmpty()) {
            String encodedAttachment = Base64.getEncoder().encodeToString(file.getBytes());
            existingPayment.setChequeAttachment(encodedAttachment);
        }
        try {
            return opdPaymentsRepository.save(existingPayment);
        } catch (Exception ex) {
            throw new CustomException("Failed to update payment: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    public void deleteOPDPayment(String ipdChargeId) {
        HMS_TM_OPDPayments payment = opdPaymentsRepository.findByOpdChargeIdAndIsActiveTrue(ipdChargeId)
                .orElseThrow(() -> new CustomException("Payment not found with ID: " + ipdChargeId, HttpStatus.BAD_REQUEST));
        payment.setActive(false);
        payment.setLastModifiedBy("modifiedBy");
        payment.setLastModifiedAt(LocalDateTime.now());
        opdPaymentsRepository.save(payment);
    }


    public IncomeChanges getOPDIncome() {
        Double todayIncome = opdPaymentsRepository.getTotalOPDIncome();
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Double yesterdayIncome = opdPaymentsRepository.getYesterdayOPDIncome(yesterday);
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

    public Double getOPDMonthlyIncome() {
        Double monthlyIncome=opdPaymentsRepository.getTotalOPDMonthlyIncome();
        return (monthlyIncome != null) ? monthlyIncome : 0.0;
    }

    public IncomeChanges getOPDIncreaseMonthlyIncome() {
        Double currentMonthIncome = opdPaymentsRepository.getTotalOPDIncomeForMonth(LocalDate.now().getMonthValue(), LocalDate.now().getYear());
        LocalDate previousMonth = LocalDate.now().minusMonths(1);
        Double previousMonthIncome = opdPaymentsRepository.getTotalOPDIncomeForMonth(previousMonth.getMonthValue(), previousMonth.getYear());
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

    public IncomeChanges getOPDIncreaseYearlyIncome() {
        int currentYear = LocalDate.now().getYear();
        int previousYear = currentYear - 1;
        Double currentYearIncome = opdPaymentsRepository.getTotalOPDIncomeForYear(currentYear);
        Double previousYearIncome = opdPaymentsRepository.getTotalOPDIncomeForYear(previousYear);
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


    public IncomeChanges getOPDIncreaseWeeklyIncome() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        LocalDate previousWeekDate = LocalDate.now().minusWeeks(1);
        int previousWeek = previousWeekDate.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int previousYear = previousWeekDate.getYear();
        Double currentWeekIncome = opdPaymentsRepository.getTotalOPDIncomeForWeek(currentWeek, currentYear);
        Double previousWeekIncome = opdPaymentsRepository.getTotalOPDIncomeForWeek(previousWeek, previousYear);
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

    public List<HMS_TM_OPDPayments> fetchAllOPDIncomeForToday() {
        return opdPaymentsRepository.getAllOPDIncomeForToday();
    }

    public List<HMS_TM_OPDPayments> fetchAllOPDIncomeForCurrentMonth() {
        int month = LocalDate.now().getMonthValue();
        int year = LocalDate.now().getYear();
        return opdPaymentsRepository.getAllOPDIncomeForMonth(month, year);
    }

    public List<HMS_TM_OPDPayments> fetchAllOPDIncomeForCurrentWeek() {
        int currentWeek = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = LocalDate.now().getYear();
        return opdPaymentsRepository.getAllOPDIncomeForWeek(currentWeek, currentYear);
    }

    public List<HMS_TM_OPDPayments> fetchAllOPDIncomeForCurrentYear() {
        int currentYear = LocalDate.now().getYear();
        return opdPaymentsRepository.getAllOPDIncomeForYear(currentYear);
    }
}

