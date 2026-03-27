package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_TPADetails;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.TpaDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TpaDetailsService {

    private final TpaDetailsRepository tpaDetailsRepository;

    @Autowired
    public TpaDetailsService(TpaDetailsRepository tpaDetailsRepository) {
        this.tpaDetailsRepository = tpaDetailsRepository;
    }

    // Create TPA Details
    public List<HMS_TM_TPADetails> createTpaDetails(List<HMS_TM_TPADetails> tpaDetailsList) {
        for (HMS_TM_TPADetails tpaDetails : tpaDetailsList) {
            tpaDetails.setActive(true);
            tpaDetails.setCreatedAt(LocalDateTime.now());
            tpaDetails.setCreatedBy("CreatedByUser");
        }
        return tpaDetailsRepository.saveAll(tpaDetailsList);
    }

    // Update TPA Details
    public HMS_TM_TPADetails updateTpaDetails(String id, HMS_TM_TPADetails tpaDetailsDetails) {
        HMS_TM_TPADetails existingDetails = tpaDetailsRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("TPA Details not found with ID: " + id, HttpStatus.NOT_FOUND));

        existingDetails.setTpaName(tpaDetailsDetails.getTpaName());
        existingDetails.setCode(tpaDetailsDetails.getCode());
        existingDetails.setContactNo(tpaDetailsDetails.getContactNo());
        existingDetails.setAddress(tpaDetailsDetails.getAddress());
        existingDetails.setContactPersonName(tpaDetailsDetails.getContactPersonName());
        existingDetails.setContactPersonPhone(tpaDetailsDetails.getContactPersonPhone());
        existingDetails.setStatus(tpaDetailsDetails.getStatus());
        existingDetails.setLastModifiedBy("ModifiedByUser");
        existingDetails.setLastModifiedAt(LocalDateTime.now());

        return tpaDetailsRepository.save(existingDetails);
    }

    // Soft Delete TPA Details
    public void deleteTpaDetails(String id) {
        HMS_TM_TPADetails tpaDetails = tpaDetailsRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("TPA Details not found with ID: " + id, HttpStatus.NOT_FOUND));

        tpaDetails.setActive(false);
        tpaDetails.setLastModifiedBy("ModifiedByUser");
        tpaDetails.setLastModifiedAt(LocalDateTime.now());
        tpaDetailsRepository.save(tpaDetails);
    }

    // Get All Active TPA Details
    public List<HMS_TM_TPADetails> getAllActiveTpaDetails() {
        return tpaDetailsRepository.findAllByIsActiveTrue();
    }

    // Get TPA Details by ID
    public HMS_TM_TPADetails getTpaDetailsById(String id) {
        return tpaDetailsRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("TPA Details not found with ID: " + id, HttpStatus.NOT_FOUND));
    }

}



