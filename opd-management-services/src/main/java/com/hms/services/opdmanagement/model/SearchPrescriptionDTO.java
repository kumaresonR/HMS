package com.hms.services.opdmanagement.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;

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

