package com.hms.services.frontofficemanagement.service;

import com.hms.services.frontofficemanagement.model.PhoneCallLog;

import java.util.List;
import java.util.UUID;


public interface PhoneCallLogService {

    public PhoneCallLog createPhoneCallLog(PhoneCallLog phoneCallLogDto);

    List<PhoneCallLog> getAllPhoneCallLogs();

    PhoneCallLog getPhoneCallLogById(UUID id);

    PhoneCallLog updatePhoneCallLog(UUID id, PhoneCallLog phoneCallLogDto);

    Boolean deletePhoneCallLogById(UUID id);
}


