package com.hms.services.notificationmanagement.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorNotificationDTO {

    @JsonProperty("AppointmentId")
    private String appointmentId;

    @JsonProperty("PatientId")
    private String patientId;

    @JsonProperty("DoctorId")
    private String doctorId;

    @JsonProperty("AppointmentDate")
    private String appointmentDate;

    @JsonProperty("AppointmentTime")
    private String appointmentTime;

    @JsonProperty("Message")
    private String message;

}

