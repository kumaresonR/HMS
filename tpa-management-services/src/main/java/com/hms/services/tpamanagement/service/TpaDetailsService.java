package com.hms.services.tpamanagement.service;



import com.hms.services.tpamanagement.entity.HMS_TM_TPADetails;
import com.hms.services.tpamanagement.exceptionhandler.CustomException;
import com.hms.services.tpamanagement.repository.TpaDetailsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class TpaDetailsService {

    private final TpaDetailsRepository tpaDetailsRepository;

    @Autowired
    public TpaDetailsService(TpaDetailsRepository tpaDetailsRepository) {
        this.tpaDetailsRepository = tpaDetailsRepository;
    }

//    // Create TPA Details
//    public List<HMS_TM_TPADetails> createTpaDetails(List<HMS_TM_TPADetails> tpaDetailsList) {
//        for (HMS_TM_TPADetails tpaDetails : tpaDetailsList) {
//            tpaDetails.setActive(true);
//            tpaDetails.setCreatedAt(LocalDateTime.now());
//            tpaDetails.setCreatedBy("CreatedByUser");
//        }
//        return tpaDetailsRepository.saveAll(tpaDetailsList);
//    }
//
//    // Update TPA Details
//    public HMS_TM_TPADetails updateTpaDetails(String id, HMS_TM_TPADetails tpaDetailsDetails) {
//        HMS_TM_TPADetails existingDetails = tpaDetailsRepository.findByIdAndIsActiveTrue(id)
//                .orElseThrow(() -> new CustomException("TPA Details not found with ID: " + id, HttpStatus.NOT_FOUND));
//
//        existingDetails.setTpaName(tpaDetailsDetails.getTpaName());
//        existingDetails.setCode(tpaDetailsDetails.getCode());
//        existingDetails.setContactNo(tpaDetailsDetails.getContactNo());
//        existingDetails.setAddress(tpaDetailsDetails.getAddress());
//        existingDetails.setContactPersonName(tpaDetailsDetails.getContactPersonName());
//        existingDetails.setContactPersonPhone(tpaDetailsDetails.getContactPersonPhone());
//        existingDetails.setStatus(tpaDetailsDetails.getStatus());
//        existingDetails.setLastModifiedBy("ModifiedByUser");
//        existingDetails.setLastModifiedAt(LocalDateTime.now());
//
//        return tpaDetailsRepository.save(existingDetails);
//    }

    public HMS_TM_TPADetails saveTpaDetails(HMS_TM_TPADetails tpaDetails, MultipartFile otherDocumentsFile) throws IOException {

        if (tpaDetailsRepository.existsByCode(tpaDetails.getCode())) {
            throw new IllegalArgumentException("Error: Code '" + tpaDetails.getCode() + "' already exists.");
        }

        if (otherDocumentsFile != null && !otherDocumentsFile.isEmpty()) {
            String encodedDocument = Base64.getEncoder().encodeToString(otherDocumentsFile.getBytes());
            tpaDetails.setOtherDocuments(encodedDocument);
        }
        tpaDetails.setActive(true);
        tpaDetails.setCreatedAt(LocalDateTime.now());
        tpaDetails.setCreatedBy("CreatedByUser");
        return tpaDetailsRepository.save(tpaDetails);
    }

    public HMS_TM_TPADetails updateTpaDetails(String id, HMS_TM_TPADetails tpaDetails, MultipartFile otherDocumentsFile) throws IOException {
        HMS_TM_TPADetails existingDetails = tpaDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TPA Details not found with ID: " + id));

        existingDetails.setTpaName(tpaDetails.getTpaName());
        existingDetails.setCode(tpaDetails.getCode());
        existingDetails.setContactNo(tpaDetails.getContactNo());
        existingDetails.setAddress(tpaDetails.getAddress());
        existingDetails.setContactPersonName(tpaDetails.getContactPersonName());
        existingDetails.setContactPersonPhone(tpaDetails.getContactPersonPhone());
        existingDetails.setStatus(tpaDetails.getStatus());
        existingDetails.setActive(existingDetails.isActive());
        existingDetails.setLastModifiedBy("ModifiedByUser");
        existingDetails.setLastModifiedAt(LocalDateTime.now());

        if (otherDocumentsFile != null && !otherDocumentsFile.isEmpty()) {
            String encodedDocument = Base64.getEncoder().encodeToString(otherDocumentsFile.getBytes());
            existingDetails.setOtherDocuments(encodedDocument);
        }

        return tpaDetailsRepository.save(existingDetails);
    }

    public void deleteTpaDetails(String id) {
        HMS_TM_TPADetails tpaDetails = tpaDetailsRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("TPA Details not found with ID: " + id, HttpStatus.NOT_FOUND));

        tpaDetails.setActive(false);
        tpaDetails.setLastModifiedBy("ModifiedByUser");
        tpaDetails.setLastModifiedAt(LocalDateTime.now());
        tpaDetailsRepository.save(tpaDetails);
    }

    @Transactional
    public List<HMS_TM_TPADetails> getAllActiveTpaDetails() {
        return tpaDetailsRepository.findAllByIsActiveTrue();
    }

    @Transactional
    public HMS_TM_TPADetails getTpaDetailsById(String id) {
        return tpaDetailsRepository.findByIdAndIsActiveTrue(id)
                .orElse(null);
    }

}

