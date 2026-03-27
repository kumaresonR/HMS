package com.hms.services.frontofficemanagement.service;

import com.hms.services.frontofficemanagement.entity.HMS_TM_Visitor;
import com.hms.services.frontofficemanagement.mapper.VisitorMapper;
import com.hms.services.frontofficemanagement.model.Visitor;
import com.hms.services.frontofficemanagement.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VisitorServiceImpl implements VisitorService {

    @Autowired
    private final VisitorRepository visitorRepository;

    @Autowired
    private final VisitorMapper visitorMapper;

    public VisitorServiceImpl(VisitorRepository visitorRepository, VisitorMapper visitorMapper) {
        this.visitorRepository = visitorRepository;
        this.visitorMapper = visitorMapper;
    }

    @Override
    public Visitor createVisitor(Visitor visitorDto) {
        HMS_TM_Visitor visitor = visitorMapper.dtoToEntity(visitorDto);
        HMS_TM_Visitor newVisitor = visitorRepository.save(visitor);
        return visitorMapper.entityToDto(newVisitor);
    }

    @Override
    public List<Visitor> getAllVisitors() {
        List<HMS_TM_Visitor> hmsTmVisitors = visitorRepository.findAll();
        return hmsTmVisitors.stream()
                .map(visitorMapper::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Visitor getVisitorById(UUID id) {
        Optional<HMS_TM_Visitor> hmsTmVisitor = visitorRepository.findById(id);
        return hmsTmVisitor.map(visitorMapper::entityToDto).orElse(null);
    }

    @Override
    public Visitor updateVisitor(UUID id, Visitor visitorDto) {
        Optional<HMS_TM_Visitor> existingVisitor = visitorRepository.findById(id);
        if(existingVisitor.isPresent()){
            HMS_TM_Visitor editedVisitor = visitorMapper.dtoToEntity(visitorDto);
            editedVisitor.setId(existingVisitor.get().getId());
            HMS_TM_Visitor savedVisitor = visitorRepository.save(editedVisitor);
            return visitorMapper.entityToDto(savedVisitor);
        }else {
            return null;
        }
    }

    @Override
    public Boolean deleteVisitorById(UUID id) {
        Optional<HMS_TM_Visitor> hmsTmVisitor = visitorRepository.findById(id);
        if(hmsTmVisitor.isPresent()){
            HMS_TM_Visitor hmsTmVisitorEntity = hmsTmVisitor.get();
            hmsTmVisitorEntity.setDeleted(true);
            visitorRepository.save(hmsTmVisitorEntity);
            return true;
        }else{
            return false;
        }
    }
}


