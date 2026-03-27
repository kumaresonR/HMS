package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_AddCompany;
import com.hms.services.adminmanagement.entity.HMS_TW_AddCompany;
import com.hms.services.adminmanagement.repository.HMS_TM_AddCompanyRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_AddCompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddCompanyService {

    @Autowired
    private HMS_TM_AddCompanyRepository tmAddCompanyRepository;

    @Autowired
    private HMS_TW_AddCompanyRepository twAddCompanyRepository;

    public List<HMS_TW_AddCompany> createCompanies(List<HMS_TW_AddCompany> companies) {
        return twAddCompanyRepository.saveAll(companies);
    }

    public HMS_TW_AddCompany getCompanyById(String id) {
        return twAddCompanyRepository.findByIdAndDeletedFalse(id).orElse(null);
    }

    public List<HMS_TW_AddCompany> getAllCompaniesTW() {
        return twAddCompanyRepository.findByDeletedFalse();
    }

    public HMS_TW_AddCompany updateCompany(String id, HMS_TW_AddCompany updatedCompany) {
        HMS_TW_AddCompany existingCompany = getCompanyById(id);
        existingCompany.setCompanyName(updatedCompany.getCompanyName());
        existingCompany.setCompanyLink(updatedCompany.getCompanyLink());
        existingCompany.setModNo(updatedCompany.getModNo());
        return twAddCompanyRepository.save(existingCompany);
    }

    public HMS_TW_AddCompany approveCompany(String id) {

        HMS_TW_AddCompany twAddCompany = getCompanyById(id);

        if ("UNAUTHORIZED".equalsIgnoreCase(twAddCompany.getAuthStat())) {
            HMS_TM_AddCompany tmAddCompany = new HMS_TM_AddCompany();
            tmAddCompany.setCompanyName(twAddCompany.getCompanyName());
            tmAddCompany.setCompanyLink(twAddCompany.getCompanyLink());
            tmAddCompany.setId(twAddCompany.getId());
            tmAddCompany.setModNo(twAddCompany.getModNo());
            tmAddCompany.setAuthStat("AUTHORIZED");
            tmAddCompanyRepository.save(tmAddCompany);

            twAddCompany.setAuthStat("AUTHORIZED");
            return twAddCompanyRepository.save(twAddCompany);
        } else {
            throw new RuntimeException("Company is already approved or rejected.");
        }
    }

    public void deleteCompany(String id, String authStat) {
        HMS_TM_AddCompany tmAddCompany = tmAddCompanyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmAddCompanyRepository.delete(tmAddCompany);

            Optional<HMS_TW_AddCompany> twAddCompanyOptional = twAddCompanyRepository.findById(id);

            if (twAddCompanyOptional.isPresent()) {
                HMS_TW_AddCompany twAddCompany = twAddCompanyOptional.get();
                twAddCompany.setAuthStat("UNAUTHORIZED");
                twAddCompany.setRecordStat("CLOSED");
                twAddCompanyRepository.save(twAddCompany);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED is allowed.");
        }
    }

    public HMS_TM_AddCompany getCompanyByIds(String id) {
        return tmAddCompanyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
    }

    public HMS_TM_AddCompany updateCompany(String id, HMS_TM_AddCompany updatedCompany) {
        HMS_TM_AddCompany existingCompany = getCompanyByIds(id);
        existingCompany.setCompanyName(updatedCompany.getCompanyName());
        return tmAddCompanyRepository.save(existingCompany);
    }

    public List<HMS_TM_AddCompany> getAllCompaniesTM() {
        return tmAddCompanyRepository.findAll();
    }

    public void deleteTwCompany(String id) {
        Optional<HMS_TW_AddCompany> companyOptional = twAddCompanyRepository.findById(id);
        if (companyOptional.isPresent()) {
            HMS_TW_AddCompany company = companyOptional.get();
            company.setDeleted(true);
            twAddCompanyRepository.save(company);
        } else {
            throw new RuntimeException("Company not found with id: " + id);
        }
    }
}




