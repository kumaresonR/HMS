package com.hms.services.ipdmanagement.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchPrescriptionDTO {

        private String id;
        private String name;
        private String prescriptionNo;
        private Boolean pharmacyPaid;
        private Boolean pathologyPaid;
        private Boolean radiologyPaid;

}

