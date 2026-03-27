package com.hms.services.ipdmanagement.model;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BedGroupDTO {


    private String bedGroupId;
    private String bedGroupName;
    private String status;
    private List<RoomsDTO> rooms;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}

