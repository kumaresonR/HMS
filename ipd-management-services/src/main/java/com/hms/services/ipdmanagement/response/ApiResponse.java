package com.hms.services.ipdmanagement.response;


import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class ApiResponse {

    private String status;
    private String error;
    private String message;
    private String ipdBed_Id;
    private String room_Id;
    private String admissionId;
    private String ipdId;
    private Long caseId;


    public ApiResponse(String status, String error, String message, String ipdBed_Id,String room_Id,String admissionId,String ipdId,Long caseId) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.ipdBed_Id = ipdBed_Id;
        this.room_Id = room_Id;
        this.admissionId = admissionId;
        this.ipdId = ipdId;
        this.caseId = caseId;
    }


}

