package com.hms.services.frontofficemanagement.service;

import com.hms.services.frontofficemanagement.entity.HMS_TM_Complaint;
import com.hms.services.frontofficemanagement.entity.HMS_TM_Postal_Receive;
import com.hms.services.frontofficemanagement.mapper.PostalReceiveMapper;
import com.hms.services.frontofficemanagement.model.PostalReceive;
import com.hms.services.frontofficemanagement.repository.PostalReceiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PostalReceiveServiceImpl implements PostalReceiveService {

    @Autowired
    private final PostalReceiveRepository postalReceiveRepository;

    @Autowired
    private final PostalReceiveMapper postalReceiveMapper;

    public PostalReceiveServiceImpl(PostalReceiveRepository postalReceiveRepository, PostalReceiveMapper postalReceiveMapper) {
        this.postalReceiveRepository = postalReceiveRepository;
        this.postalReceiveMapper = postalReceiveMapper;
    }

    @Override
    public PostalReceive createPostalReceive(PostalReceive postalReceiveDto) {
        HMS_TM_Postal_Receive hmsTmPostalReceive = postalReceiveMapper.dtoToEntity(postalReceiveDto);
        HMS_TM_Postal_Receive newHmsTmPostalReceive = postalReceiveRepository.save(hmsTmPostalReceive);
        return postalReceiveMapper.entityToDto(newHmsTmPostalReceive);
    }

    @Override
    public List<PostalReceive> getAllPostalReceives() {
        List<HMS_TM_Postal_Receive> hmsTmPostalReceives = postalReceiveRepository.findAll();
        return hmsTmPostalReceives.stream()
                .map(postalReceiveMapper::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PostalReceive getPostalReceiveById(UUID id) {
        Optional<HMS_TM_Postal_Receive> hmsTmPostalReceive = postalReceiveRepository.findById(id);
        return hmsTmPostalReceive.map(postalReceiveMapper::entityToDto).orElse(null);
    }

    @Override
    public PostalReceive updatePostalReceive(UUID id, PostalReceive postalReceiveDto) {
        Optional<HMS_TM_Postal_Receive> existingPostalReceive = postalReceiveRepository.findById(id);
        if(existingPostalReceive.isPresent()){
            HMS_TM_Postal_Receive editedHmsTmPostalReceive = postalReceiveMapper.dtoToEntity(postalReceiveDto);
            editedHmsTmPostalReceive.setId(existingPostalReceive.get().getId());
            HMS_TM_Postal_Receive savedHmsTmPostalReceive= postalReceiveRepository.save(editedHmsTmPostalReceive);
            return postalReceiveMapper.entityToDto(savedHmsTmPostalReceive);
        }else {
            return null;
        }
    }

    @Override
    public Boolean deletePostalReceiveById(UUID id) {
        Optional<HMS_TM_Postal_Receive> hmsTmPostalReceive = postalReceiveRepository.findById(id);
        if(hmsTmPostalReceive.isPresent()){
            HMS_TM_Postal_Receive hmsTmComplaintEntity = hmsTmPostalReceive.get();
            hmsTmComplaintEntity.setDeleted(true);
            postalReceiveRepository.save(hmsTmComplaintEntity);
            return true;
        }else{
            return false;
        }
    }
}


