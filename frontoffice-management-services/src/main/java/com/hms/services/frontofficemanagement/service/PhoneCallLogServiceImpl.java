package com.hms.services.frontofficemanagement.service;

import com.hms.services.frontofficemanagement.entity.HMS_TM_PhoneCallLog;
import com.hms.services.frontofficemanagement.mapper.PhoneCallLogMapper;
import com.hms.services.frontofficemanagement.model.PhoneCallLog;
import com.hms.services.frontofficemanagement.repository.PhoneCallLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PhoneCallLogServiceImpl implements PhoneCallLogService {

    @Autowired
    private final PhoneCallLogRepository phoneCallLogRepository;

    @Autowired
    private final PhoneCallLogMapper phoneCallLogMapper;

    public PhoneCallLogServiceImpl(PhoneCallLogRepository phoneCallLogRepository, PhoneCallLogMapper phoneCallLogMapper) {
        this.phoneCallLogRepository = phoneCallLogRepository;
        this.phoneCallLogMapper = phoneCallLogMapper;
    }

    @Override
    public PhoneCallLog createPhoneCallLog(PhoneCallLog phoneCallLogDto) {
        HMS_TM_PhoneCallLog hmsTmPhoneCallLog = phoneCallLogMapper.dtoToEntity(phoneCallLogDto);
        HMS_TM_PhoneCallLog newHmsTmPhoneCallLog = phoneCallLogRepository.save(hmsTmPhoneCallLog);
        return phoneCallLogMapper.entityToDto(newHmsTmPhoneCallLog);
    }

    @Override
    public List<PhoneCallLog> getAllPhoneCallLogs() {
        List<HMS_TM_PhoneCallLog> hmsTmPhoneCallLogs = phoneCallLogRepository.findAll();
        return hmsTmPhoneCallLogs.stream()
                .map(phoneCallLogMapper::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PhoneCallLog getPhoneCallLogById(UUID id) {
        Optional<HMS_TM_PhoneCallLog> hmsTmPhoneCallLog = phoneCallLogRepository.findById(id);
        return hmsTmPhoneCallLog.map(phoneCallLogMapper::entityToDto).orElse(null);
    }

    @Override
    public PhoneCallLog updatePhoneCallLog(UUID id, PhoneCallLog phoneCallLogDto) {
        Optional<HMS_TM_PhoneCallLog> existingHmsTmPhoneCallLog = phoneCallLogRepository.findById(id);
        if(existingHmsTmPhoneCallLog.isPresent()){
            HMS_TM_PhoneCallLog editedHmsTmPhoneCallLog = phoneCallLogMapper.dtoToEntity(phoneCallLogDto);
            editedHmsTmPhoneCallLog.setId(existingHmsTmPhoneCallLog.get().getId());
            HMS_TM_PhoneCallLog savedHmsTmPhoneCallLog = phoneCallLogRepository.save(editedHmsTmPhoneCallLog);
            return phoneCallLogMapper.entityToDto(savedHmsTmPhoneCallLog);
        }else {
            return null;
        }
    }

    @Override
    public Boolean deletePhoneCallLogById(UUID id) {
        Optional<HMS_TM_PhoneCallLog> hmsTmPhoneCallLog = phoneCallLogRepository.findById(id);
        if(hmsTmPhoneCallLog.isPresent()){
            HMS_TM_PhoneCallLog hmsTmPhoneCallLogEntity = hmsTmPhoneCallLog.get();
            hmsTmPhoneCallLogEntity.setDeleted(true);
            phoneCallLogRepository.save(hmsTmPhoneCallLogEntity);
            return true;
        }else{
            return false;
        }
    }
}


