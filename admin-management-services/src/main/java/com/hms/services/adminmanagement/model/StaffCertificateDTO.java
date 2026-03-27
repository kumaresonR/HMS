package com.hms.services.adminmanagement.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StaffCertificateDTO {

    @JsonProperty("Photo")
    private String photo;

    @JsonProperty("Resume")
    private String resume;

    @JsonProperty("JoiningLetter")
    private String joiningLetter;

    @JsonProperty("ResignationLetter")
    private String resignationLetter;

    @JsonProperty("OtherDocuments")
    private String otherDocuments;


}



