package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_AddReferralPerson;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_ReferralPersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReferralPersonService {

    private final HMS_TM_ReferralPersonRepository referralPersonRepository;

    @Autowired
    public ReferralPersonService(HMS_TM_ReferralPersonRepository referralPersonRepository) {
        this.referralPersonRepository = referralPersonRepository;
    }

    // Create Referral Person
    public HMS_TM_AddReferralPerson createReferralPerson(HMS_TM_AddReferralPerson referralPerson) {
        referralPerson.setCreatedAt(LocalDateTime.now());
        referralPerson.setActive(true);
        referralPerson.setCreatedBy("System");
        return referralPersonRepository.save(referralPerson);
    }

    // Update Referral Person
    public HMS_TM_AddReferralPerson updateReferralPerson(String id, HMS_TM_AddReferralPerson referralPersonDetails) {
        HMS_TM_AddReferralPerson existingPerson = referralPersonRepository.findByPersonIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Referral Person not found with ID: " + id, HttpStatus.NOT_FOUND));
        existingPerson.setReferrerName(referralPersonDetails.getReferrerName());
        existingPerson.setReferrerContact(referralPersonDetails.getReferrerContact());
        existingPerson.setContactPersonName(referralPersonDetails.getContactPersonName());
        existingPerson.setContactPersonPhone(referralPersonDetails.getContactPersonPhone());
        existingPerson.setCategory(referralPersonDetails.getCategory());
        existingPerson.setStandardCommission(referralPersonDetails.getStandardCommission());
        existingPerson.setAddress(referralPersonDetails.getAddress());
        existingPerson.setOpdCommission(referralPersonDetails.getOpdCommission());
        existingPerson.setIpdCommission(referralPersonDetails.getIpdCommission());
        existingPerson.setPharmacyCommission(referralPersonDetails.getPharmacyCommission());
        existingPerson.setPathologyCommission(referralPersonDetails.getPathologyCommission());
        existingPerson.setRadiologyCommission(referralPersonDetails.getRadiologyCommission());
        existingPerson.setBloodBankCommission(referralPersonDetails.getBloodBankCommission());
        existingPerson.setAmbulanceCommission(referralPersonDetails.getAmbulanceCommission());
        existingPerson.setLastModifiedAt(LocalDateTime.now());
        existingPerson.setLastModifiedBy("System");
        return referralPersonRepository.save(existingPerson);
    }

    // Soft Delete Referral Person
    public void deleteReferralPerson(String id) {
        HMS_TM_AddReferralPerson existingPerson = referralPersonRepository.findByPersonIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Referral Person not found with ID: " + id, HttpStatus.NOT_FOUND));
        existingPerson.setActive(false);
        existingPerson.setLastModifiedAt(LocalDateTime.now());
        existingPerson.setLastModifiedBy("System");
        referralPersonRepository.save(existingPerson);
    }

    // Get All Active Referral Persons
    public List<HMS_TM_AddReferralPerson> getAllActiveReferralPersons() {
        return referralPersonRepository.findAllByIsActiveTrue();
    }

    // Get Referral Person by ID
    public HMS_TM_AddReferralPerson getReferralPersonById(String id) {
        return referralPersonRepository.findByPersonIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Referral Person not found with ID: " + id, HttpStatus.NOT_FOUND));
    }


}



