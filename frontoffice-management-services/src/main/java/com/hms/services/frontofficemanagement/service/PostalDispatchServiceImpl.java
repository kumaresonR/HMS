package com.hms.services.frontofficemanagement.service;

import com.hms.services.frontofficemanagement.entity.HMS_TM_Postal_Dispatch;
import com.hms.services.frontofficemanagement.mapper.PostalDispatchMapper;
import com.hms.services.frontofficemanagement.model.PostalDispatch;
import com.hms.services.frontofficemanagement.repository.PostalDispatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PostalDispatchServiceImpl implements PostalDispatchService {

    @Autowired
    private final PostalDispatchRepository postalDispatchRepository;

    @Autowired
    private final PostalDispatchMapper postalDispatchMapper;

    public PostalDispatchServiceImpl(PostalDispatchRepository postalDispatchRepository, PostalDispatchMapper postalDispatchMapper) {
        this.postalDispatchRepository = postalDispatchRepository;
        this.postalDispatchMapper = postalDispatchMapper;
    }

    @Override
    public PostalDispatch createPostalDispatch(PostalDispatch postalDispatchDto) {
        HMS_TM_Postal_Dispatch hmsTmPostalDispatch = postalDispatchMapper.dtoToEntity(postalDispatchDto);
        HMS_TM_Postal_Dispatch newPostalDispatch = postalDispatchRepository.save(hmsTmPostalDispatch);
        return postalDispatchMapper.entityToDto(newPostalDispatch);
    }

    @Override
    public List<PostalDispatch> getAllPostalDispatchs() {
        List<HMS_TM_Postal_Dispatch> hmsTmPostalDispatches = postalDispatchRepository.findAll();
        return hmsTmPostalDispatches.stream()
                .map(postalDispatchMapper::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PostalDispatch getPostalDispatchById(UUID id) {
        Optional<HMS_TM_Postal_Dispatch> hmsTmPostalDispatch = postalDispatchRepository.findById(id);
        return hmsTmPostalDispatch.map(postalDispatchMapper::entityToDto).orElse(null);
    }

    @Override
    public PostalDispatch updatePostalDispatch(UUID id, PostalDispatch complaintDto) {
        Optional<HMS_TM_Postal_Dispatch> existingPostalDispatch = postalDispatchRepository.findById(id);
        if(existingPostalDispatch.isPresent()){
            HMS_TM_Postal_Dispatch editedPostalDispatch = postalDispatchMapper.dtoToEntity(complaintDto);
            editedPostalDispatch.setId(existingPostalDispatch.get().getId());
            HMS_TM_Postal_Dispatch savedPostalDispatch = postalDispatchRepository.save(editedPostalDispatch);
            return postalDispatchMapper.entityToDto(savedPostalDispatch);
        }else {
            return null;
        }
    }

    @Override
    public Boolean deletePostalDispatchById(UUID id) {
        Optional<HMS_TM_Postal_Dispatch> postalDispatch = postalDispatchRepository.findById(id);
        if(postalDispatch.isPresent()){
            HMS_TM_Postal_Dispatch hmsTmComplaintEntity = postalDispatch.get();
            hmsTmComplaintEntity.setDeleted(true);
            postalDispatchRepository.save(hmsTmComplaintEntity);
            return true;
        }else{
            return false;
        }
    }
}


