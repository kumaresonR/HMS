package com.hms.services.frontofficemanagement.mapper;

import com.hms.services.frontofficemanagement.entity.HMS_TM_PhoneCallLog;
import com.hms.services.frontofficemanagement.enums.CallType;
import com.hms.services.frontofficemanagement.model.PhoneCallLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface PhoneCallLogMapper {

    @Mapping(target = "call_type", source = "callType", qualifiedByName = "enumToString")
    @Mapping(target = "contact", source = "mobileNumber" )
    @Mapping(target = "call_duration", source = "callDuration" )
    @Mapping(target = "date", source = "date", qualifiedByName = "dateToString")
    @Mapping(target = "follow_up_date", source = "followUpDate", qualifiedByName = "dateToString")
    @Mapping(target = "id", source = "id", qualifiedByName = "uuidToString")
    PhoneCallLog entityToDto(HMS_TM_PhoneCallLog hmsTmPhoneCallLog);

    @Mapping(target = "callType", source = "call_type", qualifiedByName = "stringToEnum")
    @Mapping(target = "followUpDate", source = "follow_up_date", qualifiedByName = "stringToDate")
    @Mapping(target = "mobileNumber", source = "contact" )
    @Mapping(target = "date", source = "date", qualifiedByName = "stringToDate")
    @Mapping(target = "deleted", source = "deleted", qualifiedByName = "defaultIsDeleted")
    @Mapping(target = "id", qualifiedByName = "stringToUuid")
    @Mapping(target = "callDuration", source = "call_duration" )
    HMS_TM_PhoneCallLog dtoToEntity(PhoneCallLog phoneCallLogDto);

    @Named("uuidToString")
    default String uuidToString(UUID id) {
        return (id != null) ? id.toString() : null;
    }

    @Named("stringToUuid")
    default UUID generateUUID(String id) {
        return (id != null && !id.isEmpty()) ? UUID.fromString(id) : UUID.randomUUID();
    }

    @Named("enumToString")
    default String enumToString(CallType callType) {
        return callType != null ? callType.name() : null;
    }

    @Named("stringToEnum")
    default CallType stringToEnum(String callType) {
        return callType != null ? CallType.valueOf(callType) : null;
    }

    @Named("byteArrayToBase64")
    default String byteArrayToBase64(byte[] content) {
        return content != null ? Base64.getEncoder().encodeToString(content) : null;
    }

    @Named("base64ToByteArray")
    default byte[] base64ToByteArray(String fileContent) {
        return fileContent != null ? Base64.getDecoder().decode(fileContent) : null;
    }


    @Named("defaultIsDeleted")
    default boolean setDefaultIsDeleted(Boolean isDeleted) {
        return isDeleted != null ? isDeleted : false;
    }

    @Named("stringToDate")
    default Date stringToDate(String dateString) {
        if (dateString == null) return null;
        try {
            return new SimpleDateFormat("dd/MM/yyyy").parse(dateString);
        } catch (ParseException e) {
            throw new RuntimeException("Error parsing date: " + dateString, e);
        }
    }

    @Named("dateToString")
    default String dateToString(Date date) {
        if (date == null) return null;
        return new SimpleDateFormat("dd/MM/yyyy").format(date);
    }
}


