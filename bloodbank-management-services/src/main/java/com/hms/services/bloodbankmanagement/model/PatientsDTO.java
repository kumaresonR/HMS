package com.hms.services.bloodbankmanagement.model;


import lombok.Data;

@Data
public class PatientsDTO {
    private String id;
    private String patientId;
    private String firstName;
    private String lastName;
    private String dateOfBirth;
    private String gender;
    private String age;
    private String contactNumber;
    private String email;
    private String address;
    private String pinCode;
    private String state;
    private String nationality;
    private String idProof;
    private String idNumber;
    private String bloodType;
    private String allergies;
    private TPADetailsDTO tpaDetails;
}


