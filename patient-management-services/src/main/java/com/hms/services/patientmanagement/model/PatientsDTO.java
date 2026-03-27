package com.hms.services.patientmanagement.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class PatientsDTO {

    private String id;
    private String patientId;
    @NotBlank(message = "FirstName cannot be blank")
    private String firstName;
    @NotBlank(message = "LastName cannot be blank")
    private String lastName;
    @NotBlank(message = "DateOfBirth cannot be blank")
    private String dateOfBirth;
    @NotBlank(message = "Gender cannot be blank")
    private String gender;
    private String age;
    @NotBlank(message = "ContactNumber cannot be blank")
    @Pattern(regexp = "\\(?\\+[0-9]{1,3}\\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\\w{1,10}\\s?\\d{1,6})?",
            message = "Invalid  ContactNumber Format")
    private String contactNumber;
    @Pattern(regexp = "^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$",
            message = "Invalid  mailId Format")
    private String email;
    @NotBlank(message = "Address cannot be blank")
    private String address;
    @NotBlank(message = "PinCode cannot be blank")
    private String pinCode;
    @NotBlank(message = "State cannot be blank")
    private String state;
    @NotBlank(message = "Nationality cannot be blank")
    private String nationality;
    private String idProof;
    private String idNumber;
    private String bloodType;
    private String allergies;
    private String oldPrescription;
    private InsuranceProvidersDTO insuranceProviders;
    private Integer version;
    private List<EmergencyContactsDTO> emergencyContacts;

}

