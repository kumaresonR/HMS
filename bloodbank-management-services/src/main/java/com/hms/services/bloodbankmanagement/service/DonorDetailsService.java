package com.hms.services.bloodbankmanagement.service;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_BloodDonorDetails;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_DonorDetails;
import com.hms.services.bloodbankmanagement.repository.DonorDetailsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DonorDetailsService {

    @Autowired
    private DonorDetailsRepository donorDetailsRepository;

    public HMS_TM_DonorDetails createDonor(HMS_TM_DonorDetails donor) {
        return donorDetailsRepository.save(donor);
    }

    @Transactional
    public List<HMS_TM_DonorDetails> getAllDonors() {
        return donorDetailsRepository.findAllByDeletedFalse();
    }

    @Transactional
    public Optional<HMS_TM_DonorDetails> getDonorById(String id) {
        return donorDetailsRepository.findByDonorIdAndDeletedFalse(id);
    }

    public HMS_TM_DonorDetails updateDonor(String id, HMS_TM_DonorDetails donor) {
        if (donorDetailsRepository.existsById(id)) {
            donor.setDonorId(id);
            return donorDetailsRepository.save(donor);
        }
        return null;
    }

    public HMS_TM_DonorDetails deleteDonor(String id) {
        Optional<HMS_TM_DonorDetails> hmsTmDonorDetails = donorDetailsRepository.findById(id);

        if (hmsTmDonorDetails.isPresent()) {
            HMS_TM_DonorDetails existingBloodDonor = hmsTmDonorDetails.get();
            existingBloodDonor.setDeleted(true);
            return donorDetailsRepository.save(existingBloodDonor);
        } else {
            throw new RuntimeException(" Donor not found with ID: " + id);
        }
    }

    @Transactional
    public List<HMS_TM_DonorDetails> searchDonorsByName(String donorName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc("donorName")));
        Page<HMS_TM_DonorDetails> donorPage = donorDetailsRepository.findByDonorNameContainingIgnoreCaseAndDeletedFalse(donorName, pageable);
        return donorPage.getContent();
    }
}



