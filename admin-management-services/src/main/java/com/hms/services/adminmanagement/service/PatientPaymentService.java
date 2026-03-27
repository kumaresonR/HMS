package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_PatientPayment;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_PatientPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PatientPaymentService {

    private final HMS_TM_PatientPaymentRepository patientPaymentRepository;

    @Autowired
    public PatientPaymentService(HMS_TM_PatientPaymentRepository patientPaymentRepository) {
        this.patientPaymentRepository = patientPaymentRepository;
    }

    // Create Patient Payment
    public HMS_TM_PatientPayment createPatientPayment(HMS_TM_PatientPayment patientPayment) {
        patientPayment.setCreatedAt(LocalDateTime.now());
        patientPayment.setActive(true);
        patientPayment.setCreatedBy("System");
        return patientPaymentRepository.save(patientPayment);
    }

    // Update Patient Payment
    public HMS_TM_PatientPayment updatePatientPayment(String id, HMS_TM_PatientPayment paymentDetails) {
        HMS_TM_PatientPayment existingPayment = patientPaymentRepository.findByBillIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Patient Payment not found with ID: " + id, HttpStatus.NOT_FOUND));
        existingPayment.setPatientId(paymentDetails.getPatientId());
        existingPayment.setPatientType(paymentDetails.getPatientType());
        existingPayment.setBillNo(paymentDetails.getBillNo());
        existingPayment.setPatientBillAmount(paymentDetails.getPatientBillAmount());
        existingPayment.setPayee(paymentDetails.getPayee());
        existingPayment.setCommissionPercentage(paymentDetails.getCommissionPercentage());
        existingPayment.setCommissionAmount(paymentDetails.getCommissionAmount());
//        existingPayment.setStatus(paymentDetails.getStatus());
        existingPayment.setLastModifiedAt(LocalDateTime.now());
        existingPayment.setLastModifiedBy("System");
        return patientPaymentRepository.save(existingPayment);
    }

    // Soft Delete Patient Payment
    public void deletePatientPayment(String id) {
        HMS_TM_PatientPayment existingPayment = patientPaymentRepository.findByBillIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Patient Payment not found with ID: " + id, HttpStatus.NOT_FOUND));
        existingPayment.setActive(false);
        existingPayment.setLastModifiedAt(LocalDateTime.now());
        existingPayment.setLastModifiedBy("System");
        patientPaymentRepository.save(existingPayment);
    }

    // Get All Active Patient Payments
    public List<HMS_TM_PatientPayment> getAllActivePatientPayments() {
        return patientPaymentRepository.findAllByIsActiveTrue();
    }

    // Get Patient Payment by ID
    public HMS_TM_PatientPayment getPatientPaymentById(String id) {
        return patientPaymentRepository.findByBillIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Patient Payment not found with ID: " + id, HttpStatus.NOT_FOUND));
    }



}



