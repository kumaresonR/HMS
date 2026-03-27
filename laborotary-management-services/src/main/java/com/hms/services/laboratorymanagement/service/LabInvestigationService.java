package com.hms.services.laboratorymanagement.service;

import com.hms.services.laboratorymanagement.entity.HMS_TM_LabInvestigation;
import com.hms.services.laboratorymanagement.repository.LabInvestigationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LabInvestigationService {

    private final LabInvestigationRepository repository;

    public LabInvestigationService(LabInvestigationRepository repository) {
        this.repository = repository;
    }

    public List<HMS_TM_LabInvestigation> getAll() {
        return repository.findAll();
    }

    public Optional<HMS_TM_LabInvestigation> getById(String id) {
        return repository.findById(id);
    }

    public HMS_TM_LabInvestigation create(HMS_TM_LabInvestigation labInvestigation) {
        return repository.save(labInvestigation);
    }

    public HMS_TM_LabInvestigation update(String id, HMS_TM_LabInvestigation labInvestigation) {
        labInvestigation.setId(id);
        return repository.save(labInvestigation);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}

