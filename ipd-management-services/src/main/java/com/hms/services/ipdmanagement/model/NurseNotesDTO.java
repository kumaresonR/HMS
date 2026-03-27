package com.hms.services.ipdmanagement.model;


import com.hms.services.ipdmanagement.entity.HMS_TM_Comments;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
public class NurseNotesDTO {

    private String notesId;
    private String ipdId;
    private String nurseId;
    private LocalDateTime date;
    private String note;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime createdAt;
    private List<CommentsDTO> comments;

}

