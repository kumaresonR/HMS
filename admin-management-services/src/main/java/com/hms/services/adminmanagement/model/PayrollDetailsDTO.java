package com.hms.services.adminmanagement.model;

import com.hms.services.adminmanagement.entity.HMS_TM_Payroll;
import lombok.Data;

@Data
public class PayrollDetailsDTO {

    private HMS_TM_Payroll payroll;
    private EmployeeDTO employeeDetails;

}




