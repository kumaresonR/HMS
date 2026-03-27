package com.hms.services.frontofficemanagement.mapper;

import com.hms.services.frontofficemanagement.entity.HMS_TM_Visitor;
import com.hms.services.frontofficemanagement.model.Visitor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Base64;
import java.util.Date;
import java.util.Locale;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface VisitorMapper {


    @Mapping(target = "file", source = "file", qualifiedByName = "byteArrayToBase64")
    @Mapping(target = "no_of_people", source = "noOfPeople")
    @Mapping(target = "ipd_opd_staff", source = "staffName")
    @Mapping(target = "visit_to", source = "visitTo" )
    @Mapping(target = "id_card", source = "idCard" )
    @Mapping(target = "date", source = "date", qualifiedByName = "dateToString")
    @Mapping(target = "contact", source = "mobileNumber" )
    @Mapping(target = "in_time", source = "inTime", qualifiedByName = "extractTime")
    @Mapping(target = "out_time", source = "outTime", qualifiedByName = "extractTime")
    @Mapping(target = "id", source = "id", qualifiedByName = "uuidToString")
    Visitor entityToDto(HMS_TM_Visitor hmsTmVisitor);

    @Mapping(target = "idCard", source = "id_card" )
    @Mapping(target = "visitTo", source = "visit_to" )
    @Mapping(target = "staffName", source = "ipd_opd_staff")
    @Mapping(target = "noOfPeople", source = "no_of_people")
    @Mapping(target = "deleted", source = "deleted", qualifiedByName = "defaultIsDeleted")
    @Mapping(target = "file", source = "file", qualifiedByName = "base64ToByteArray")
    @Mapping(target = "mobileNumber", source = "contact" )
    @Mapping(target = "date", source = "date", qualifiedByName = "stringToDate")
    @Mapping(target = "id", qualifiedByName = "stringToUuid")
    @Mapping(target = "inTime", source = "visitor", qualifiedByName = "combineDateAndInTime")
    @Mapping(target = "outTime", source = "visitor", qualifiedByName = "combineDateAndOutTime")
    HMS_TM_Visitor dtoToEntity(Visitor visitor);

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

    @Named("combineDateAndInTime")
    default OffsetDateTime combineDateAndInTime(Visitor visitor) {
        if (visitor.getDate() == null || visitor.getIn_time() == null) {
            return null;
        }
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);

        try {
            LocalDate localDate = LocalDate.parse(visitor.getDate().trim(), dateFormatter);
            LocalTime localTime = LocalTime.parse(visitor.getIn_time(), timeFormatter);

            return OffsetDateTime.of(localDate, localTime, ZoneOffset.UTC); // Adjust ZoneOffset if needed
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date or time format: " + e.getMessage(), e);
        }

    }

    @Named("combineDateAndOutTime")
    default OffsetDateTime combineDateAndOutTime(Visitor visitor) {
        if (visitor.getDate() == null || visitor.getIn_time() == null) {
            return null;
        }
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);

        try {
            LocalDate localDate = LocalDate.parse(visitor.getDate().trim(), dateFormatter);
            LocalTime localTime = LocalTime.parse(visitor.getOut_time(), timeFormatter);

            return OffsetDateTime.of(localDate, localTime, ZoneOffset.UTC); // Adjust ZoneOffset if needed
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date or time format: " + e.getMessage(), e);
        }

    }

    @Named("extractTime")
    default String extractTime(OffsetDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.toLocalTime().format(DateTimeFormatter.ofPattern("hh:mm a")).toUpperCase();
    }
}


