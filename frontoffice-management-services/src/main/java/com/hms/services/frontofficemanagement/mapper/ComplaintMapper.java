package com.hms.services.frontofficemanagement.mapper;

import com.hms.services.frontofficemanagement.model.Complaint;
import com.hms.services.frontofficemanagement.entity.HMS_TM_Complaint;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import java.text.ParseException;

import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface ComplaintMapper {

    @Mapping(target = "file", source = "file", qualifiedByName = "byteArrayToBase64")
    @Mapping(target = "complaint", source = "complaintType")
    @Mapping(target = "contact", source = "mobileNumber" )
    @Mapping(target = "date", source = "date", qualifiedByName = "dateToString")
    @Mapping(target = "action_taken", source = "actionTaken" )
    @Mapping(target = "id", source = "id", qualifiedByName = "uuidToString")
    Complaint entityToDto(HMS_TM_Complaint hmsTmComplaint);

    @Mapping(target = "complaintType", source = "complaint")
    @Mapping(target = "file", source = "file", qualifiedByName = "base64ToByteArray")
    @Mapping(target = "mobileNumber", source = "contact" )
    @Mapping(target = "date", source = "date", qualifiedByName = "stringToDate")
    @Mapping(target = "id", qualifiedByName = "stringToUuid")
    @Mapping(target = "actionTaken", source = "action_taken" )
    @Mapping(target = "deleted", source = "deleted", qualifiedByName = "defaultIsDeleted")
    HMS_TM_Complaint dtoToEntity(Complaint complaint);

    @Named("uuidToString")
    default String uuidToString(UUID id) {
        return (id != null) ? id.toString() : null;
    }

    @Named("stringToUuid")
    default UUID generateUUID(String id) {
        return (id != null && !id.isEmpty()) ? UUID.fromString(id) : UUID.randomUUID();
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
}


