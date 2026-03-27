package com.hms.services.frontofficemanagement.service;

import com.hms.services.frontofficemanagement.entity.HMS_TM_Complaint;
import com.hms.services.frontofficemanagement.mapper.ComplaintMapper;
import com.hms.services.frontofficemanagement.model.Complaint;
import com.hms.services.frontofficemanagement.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    @Autowired
    private final ComplaintRepository complaintRepository;

    @Autowired
    private final ComplaintMapper complaintMapper;

    public ComplaintServiceImpl(ComplaintRepository complaintRepository, ComplaintMapper complaintMapper) {
        this.complaintRepository = complaintRepository;
        this.complaintMapper = complaintMapper;
    }

    @Override
    public Complaint createComplaint(Complaint complaintDto) {
        HMS_TM_Complaint complaint = complaintMapper.dtoToEntity(complaintDto);
        HMS_TM_Complaint newComplaint = complaintRepository.save(complaint);
        return complaintMapper.entityToDto(newComplaint);
    }

    @Override
    public List<Complaint> getAllComplaints() {
        List<HMS_TM_Complaint> hmsTmComplaints = complaintRepository.findAll();
        return hmsTmComplaints.stream()
                .map(complaintMapper::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Complaint getComplaintById(UUID id) {
        Optional<HMS_TM_Complaint> hmsTmComplaint = complaintRepository.findById(id);
        return hmsTmComplaint.map(complaintMapper::entityToDto).orElse(null);
    }

    @Override
    public Complaint updateComplaint(UUID id, Complaint complaintDto) {
        Optional<HMS_TM_Complaint> existingComplaint = complaintRepository.findById(id);
        if(existingComplaint.isPresent()){
            HMS_TM_Complaint editedComplaint = complaintMapper.dtoToEntity(complaintDto);
            editedComplaint.setId(existingComplaint.get().getId());
            HMS_TM_Complaint savedComplaint = complaintRepository.save(editedComplaint);
            return complaintMapper.entityToDto(savedComplaint);
        }else {
            return null;
        }
    }

    @Override
    public Boolean deleteComplaintById(UUID id) {
        Optional<HMS_TM_Complaint> hmsTmComplaint = complaintRepository.findById(id);
        if(hmsTmComplaint.isPresent()){
            HMS_TM_Complaint hmsTmComplaintEntity = hmsTmComplaint.get();
            hmsTmComplaintEntity.setDeleted(true);
            complaintRepository.save(hmsTmComplaintEntity);
            return true;
        }else{
            return false;
        }
    }
}


