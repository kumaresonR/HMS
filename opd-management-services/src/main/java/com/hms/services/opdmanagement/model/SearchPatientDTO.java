package com.hms.services.opdmanagement.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchPatientDTO {

    private String id;
    private String name;
    private String patientId;
}

