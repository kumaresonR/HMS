package com.hms.services.adminmanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveSummaryDTO {
    private String leaveType;
    private int allocatedLeaves;
    private int usedLeaves;
    private int remainingLeaves;
}



