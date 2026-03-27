package com.hms.services.patientmanagement.response;


import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class ApiResponse {

    private String status;
    private String error;
    private String message;
    private String patient_id;
    private String appointment_id;
    private String insurance_id;
    private String prescription_id;

    public ApiResponse(String status, String error, String message, String patient_id,
                       String appointment_id,String insurance_id,String prescription_id) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.patient_id = patient_id;
        this.appointment_id = appointment_id;
        this.insurance_id = insurance_id;
        this.prescription_id = prescription_id;
    }
}

