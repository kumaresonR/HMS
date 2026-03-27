package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_IncomeHead;
import com.hms.services.adminmanagement.entity.HMS_TM_LeaveType;
import com.hms.services.adminmanagement.entity.HMS_TW_IncomeHead;
import com.hms.services.adminmanagement.entity.HMS_TW_LeaveType;
import com.hms.services.adminmanagement.repository.HMS_TM_IncomeHeadRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_IncomeHeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncomeHeadService {

    @Autowired
    private HMS_TW_IncomeHeadRepository twIncomeHeadRepository;

    @Autowired
    private HMS_TM_IncomeHeadRepository tmIncomeHeadRepository;

    public List<HMS_TW_IncomeHead> createTwIncomeHeads(List<HMS_TW_IncomeHead> incomeHeads) {
        return twIncomeHeadRepository.saveAll(incomeHeads);
    }

    public HMS_TW_IncomeHead getTwIncomeHeadById(String id) {
        return twIncomeHeadRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_IncomeHead> getAllTwIncomeHeads() {
        return twIncomeHeadRepository.findByDeletedFalse();
    }

    public HMS_TW_IncomeHead updateTwIncomeHead(String id, HMS_TW_IncomeHead updatedIncomeHead) {
        HMS_TW_IncomeHead existingIncomeHead = getTwIncomeHeadById(id);
        existingIncomeHead.setIncomeHead(updatedIncomeHead.getIncomeHead());
        existingIncomeHead.setDescription(updatedIncomeHead.getDescription());
        existingIncomeHead.setModNo(updatedIncomeHead.getModNo());
        return twIncomeHeadRepository.save(existingIncomeHead);
    }

    public HMS_TM_IncomeHead approveTwIncomeHead(String id) {
        HMS_TW_IncomeHead twIncomeHead = getTwIncomeHeadById(id);

        if ("UNAUTHORIZED".equals(twIncomeHead.getAuthStat())) {
        HMS_TM_IncomeHead tmIncomeHead = new HMS_TM_IncomeHead();
        tmIncomeHead.setId(twIncomeHead.getId());
        tmIncomeHead.setModNo(twIncomeHead.getModNo());
        tmIncomeHead.setIncomeHead(twIncomeHead.getIncomeHead());
        tmIncomeHead.setDescription(twIncomeHead.getDescription());
        tmIncomeHead.setAuthStat("AUTHORIZED");
        tmIncomeHeadRepository.save(tmIncomeHead);
        twIncomeHead.setAuthStat("AUTHORIZED");
        twIncomeHead.setRecordStat("OPENED");
        twIncomeHeadRepository.save(twIncomeHead);
        return tmIncomeHead;
        } else {
            throw new RuntimeException("Income Head is already approved or rejected");
        }
    }

    public void deleteTwIncomeHeads(String id, String authStat) {
        HMS_TM_IncomeHead tmIncomeHead = tmIncomeHeadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income Head not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmIncomeHeadRepository.delete(tmIncomeHead);

            Optional<HMS_TW_IncomeHead> twIncomeHeadOptional = twIncomeHeadRepository.findById(id);

            if (twIncomeHeadOptional.isPresent()) {
                HMS_TW_IncomeHead twIncomeHead = twIncomeHeadOptional.get();
                twIncomeHead.setAuthStat("UNAUTHORIZED");
                twIncomeHead.setRecordStat("CLOSED");
                twIncomeHeadRepository.save(twIncomeHead);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED status is allowed for deletion.");
        }
    }

    public HMS_TM_IncomeHead getTmIncomeHeadById(String id) {
        return tmIncomeHeadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income Head not found with id: " + id));
    }

    public HMS_TM_IncomeHead updateTmIncomeHead(String id, HMS_TM_IncomeHead updatedIncomeHead) {
        HMS_TM_IncomeHead existingIncomeHead = getTmIncomeHeadById(id);
        existingIncomeHead.setIncomeHead(updatedIncomeHead.getIncomeHead());
        existingIncomeHead.setDescription(updatedIncomeHead.getDescription());
        return tmIncomeHeadRepository.save(existingIncomeHead);
    }

    public void deleteTwIncomeHead(String id) {
        HMS_TW_IncomeHead incomeHead = getTwIncomeHeadById(id);
        incomeHead.setDeleted(true);
        twIncomeHeadRepository.save(incomeHead);
    }

    public List<HMS_TM_IncomeHead> getAllTmIncomeHeads() {
        return tmIncomeHeadRepository.findAll();
    }
}



