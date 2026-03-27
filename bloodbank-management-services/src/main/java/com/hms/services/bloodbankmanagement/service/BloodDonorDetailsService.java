package com.hms.services.bloodbankmanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_BloodDonorDetails;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_DonorDetails;
import com.hms.services.bloodbankmanagement.model.BloodDonorDetailsDTO;
import com.hms.services.bloodbankmanagement.repository.BloodDonorDetailsRepository;
import com.hms.services.bloodbankmanagement.repository.DonorDetailsRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class BloodDonorDetailsService {

    @Autowired
    private BloodDonorDetailsRepository bloodDonorDetailsRepository;

    @Autowired
    private DonorDetailsRepository donorDetailsRepository;

    public HMS_TM_BloodDonorDetails generateBloodDonor(String bloodDataJson, MultipartFile attachmentFile) throws IOException, IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_BloodDonorDetails bloodDonor = objectMapper.readValue(bloodDataJson, HMS_TM_BloodDonorDetails.class);

        double total = bloodDonor.getTotal() != null ? bloodDonor.getTotal() : 0.0;
        double paymentAmount = bloodDonor.getPaymentAmount() != null ? bloodDonor.getPaymentAmount() : 0.0;
        double balanceAmount = total - paymentAmount;
        bloodDonor.setBalanceAmount(balanceAmount > 0 ? balanceAmount : 0.0);

        if (attachmentFile != null) {
            byte[] fileBytes = attachmentFile.getBytes();
            String encodedFile = Base64.getEncoder().encodeToString(fileBytes);
            bloodDonor.setAttachDocument(encodedFile);
        }

        return bloodDonorDetailsRepository.save(bloodDonor);
    }

    @Transactional
    public List<BloodDonorDetailsDTO> getAllBloodDonorsWithDonorDetails() {
        List<HMS_TM_BloodDonorDetails> bloodDonorDetailsList = bloodDonorDetailsRepository.findByDeletedFalse();
        List<BloodDonorDetailsDTO> result = new ArrayList<>();

        for (HMS_TM_BloodDonorDetails bloodDonorDetails : bloodDonorDetailsList) {
            HMS_TM_DonorDetails donorDetails = donorDetailsRepository.findByDonorIdAndDeletedFalse(bloodDonorDetails.getDonorId())
                    .orElseThrow(() -> new RuntimeException("Donor not found for ID: " + bloodDonorDetails.getDonorId()));

            result.add(new BloodDonorDetailsDTO(bloodDonorDetails, donorDetails));
        }

        return result;
    }

    @Transactional
    public BloodDonorDetailsDTO getBloodDonorByIdWithDonorDetails(String bloodDonorId) {
        HMS_TM_BloodDonorDetails bloodDonorDetails = bloodDonorDetailsRepository.findByBloodDonorIdAndDeletedFalse(bloodDonorId)
                .orElseThrow(() -> new RuntimeException("Blood donor not found for ID: " + bloodDonorId));

        HMS_TM_DonorDetails donorDetails = donorDetailsRepository.findByDonorIdAndDeletedFalse(bloodDonorDetails.getDonorId())
                .orElseThrow(() -> new RuntimeException("Donor not found for ID: " + bloodDonorDetails.getDonorId()));

        return new BloodDonorDetailsDTO(bloodDonorDetails, donorDetails);
    }

    public HMS_TM_BloodDonorDetails updateBloodDonor(String id, String bloodDataJson, MultipartFile attachmentFile) throws IOException {
        if (!bloodDonorDetailsRepository.existsById(id)) {
            throw new EntityNotFoundException("Blood Donor with ID " + id + " not found.");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        HMS_TM_BloodDonorDetails bloodDonor = objectMapper.readValue(bloodDataJson, HMS_TM_BloodDonorDetails.class);

        HMS_TM_BloodDonorDetails existingBloodDonor = bloodDonorDetailsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Blood Donor with ID " + id + " not found."));

        bloodDonor.setBloodDonorId(id);

        Double previousPaymentAmount = existingBloodDonor.getPaymentAmount() != null ? existingBloodDonor.getPaymentAmount() : 0.0;
        Double balanceAmount = existingBloodDonor.getTotal() != null ? existingBloodDonor.getTotal() - previousPaymentAmount : 0.0;

        Double newPaymentAmount = bloodDonor.getPaymentAmount();
        if (newPaymentAmount != null && newPaymentAmount > 0) {
            bloodDonor.setPaymentAmount(previousPaymentAmount + newPaymentAmount);
            balanceAmount -= newPaymentAmount;
        } else {
            bloodDonor.setPaymentAmount(previousPaymentAmount);
        }

        bloodDonor.setBalanceAmount(balanceAmount > 0 ? balanceAmount : 0.0);

        if (attachmentFile != null) {
            byte[] fileBytes = attachmentFile.getBytes();
            String encodedFile = Base64.getEncoder().encodeToString(fileBytes);
            bloodDonor.setAttachDocument(encodedFile);
        } else {
            bloodDonor.setAttachDocument(existingBloodDonor.getAttachDocument());
        }

        return bloodDonorDetailsRepository.save(bloodDonor);
    }

    public HMS_TM_BloodDonorDetails softDeleteBloodDonor(String id) {
        Optional<HMS_TM_BloodDonorDetails> existingBloodDonorOpt = bloodDonorDetailsRepository.findById(id);

        if (existingBloodDonorOpt.isPresent()) {
            HMS_TM_BloodDonorDetails existingBloodDonor = existingBloodDonorOpt.get();
            existingBloodDonor.setDeleted(true);
            return bloodDonorDetailsRepository.save(existingBloodDonor);
        } else {
            throw new RuntimeException("Blood Donor not found with ID: " + id);
        }
    }
}


