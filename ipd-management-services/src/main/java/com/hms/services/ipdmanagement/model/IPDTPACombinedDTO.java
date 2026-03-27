package com.hms.services.ipdmanagement.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
public class IPDTPACombinedDTO {

    private String admissionId;
    private String patientId;
    private String doctorId;
    private String nurseId;
    private LocalDateTime admissionDate;
    private String roomId;
    private String reasonForAdmission;
    private String symptomsType;
    private String symptomsTitle;
    private String symptomsDescription;
    private String note;

    private IPDCombinedDTO.PatientDTO patientDetails;
    private TPADetailsDTO tpaDetails;

    public IPDTPACombinedDTO(
            String admissionId,
            String patientId,
            String doctorId,
            String nurseId,
            LocalDateTime admissionDate,
            String roomId,
            String reasonForAdmission,
            String symptomsType,
            String symptomsTitle,
            String symptomsDescription,
            String note,
            IPDCombinedDTO.PatientDTO patientDetails,
            TPADetailsDTO tpaDetails
    ) {
        this.admissionId = admissionId;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.nurseId = nurseId;
        this.admissionDate = admissionDate;
        this.roomId = roomId;
        this.reasonForAdmission = reasonForAdmission;
        this.symptomsType = symptomsType;
        this.symptomsTitle = symptomsTitle;
        this.symptomsDescription = symptomsDescription;
        this.note = note;
        this.patientDetails = patientDetails;
        this.tpaDetails = tpaDetails;
    }
}


