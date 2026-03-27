package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.HMS_TM_PatientIDCard;
import com.hms.services.adminmanagement.repository.PatientIDCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class PatientIDCardService {

    private final PatientIDCardRepository patientIDCardRepository;

    @Autowired
    public PatientIDCardService(PatientIDCardRepository patientIDCardRepository) {
        this.patientIDCardRepository = patientIDCardRepository;
    }

    // 1. Save Patient ID Card
    public HMS_TM_PatientIDCard savePatientIDCard(HMS_TM_PatientIDCard patientIDCard,
                                                  MultipartFile backgroundImageFile,
                                                  MultipartFile logoFile,
                                                  MultipartFile signatureFile) throws IOException {

        handleFileUploads(patientIDCard, backgroundImageFile, logoFile, signatureFile);
        patientIDCard.setActive(true);
        patientIDCard.setCreatedAt(LocalDateTime.now());
        return patientIDCardRepository.save(patientIDCard);
    }

    // 2. Update Patient ID Card
    public HMS_TM_PatientIDCard updatePatientIDCard(String id, HMS_TM_PatientIDCard updatedData,
                                                    MultipartFile backgroundImageFile,
                                                    MultipartFile logoFile,
                                                    MultipartFile signatureFile) throws IOException {
        HMS_TM_PatientIDCard existingCard = patientIDCardRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Patient ID Card not found"));

        // Update fields
        existingCard.setPatientName(updatedData.getPatientName());
        existingCard.setPatientId(updatedData.getPatientId());
        existingCard.setPhoneNumber(updatedData.getPhoneNumber());
        existingCard.setAddress(updatedData.getAddress());
        existingCard.setBloodGroup(updatedData.getBloodGroup());

        // Handle file updates
        handleFileUploads(existingCard, backgroundImageFile, logoFile, signatureFile);
        return patientIDCardRepository.save(existingCard);
    }

    // 3. Get All Patient ID Cards
    public List<HMS_TM_PatientIDCard> getAllPatientIDCards() {
        return patientIDCardRepository.findAllByIsActiveTrue();
    }

    // 4. Get Patient ID Card by ID
    public HMS_TM_PatientIDCard getPatientIDCardById(String id) {
        return patientIDCardRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Patient ID Card not found"));
    }

    // 5. Soft Delete Patient ID Card
    public void softDeletePatientIDCard(String id) {
        HMS_TM_PatientIDCard patientIDCard = patientIDCardRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Patient ID Card not found"));
        patientIDCard.setActive(false);
        patientIDCardRepository.save(patientIDCard);
    }

    // Handle file uploads
    private void handleFileUploads(HMS_TM_PatientIDCard patientIDCard,
                                   MultipartFile backgroundImageFile,
                                   MultipartFile logoFile,
                                   MultipartFile signatureFile) throws IOException {
        if (backgroundImageFile != null && !backgroundImageFile.isEmpty()) {
            patientIDCard.setBackgroundImage(Base64.getEncoder().encodeToString(backgroundImageFile.getBytes()));
        }

        if (logoFile != null && !logoFile.isEmpty()) {
            patientIDCard.setLogoImage(Base64.getEncoder().encodeToString(logoFile.getBytes()));
        }

        if (signatureFile != null && !signatureFile.isEmpty()) {
            patientIDCard.setSignatureImage(Base64.getEncoder().encodeToString(signatureFile.getBytes()));
        }
    }
}



