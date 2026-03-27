package com.hms.services.adminmanagement.scheduler;
import com.hms.services.adminmanagement.repository.HMS_TM_EmployeeRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class PayrollStatusScheduler {


    private final HMS_TM_EmployeeRepository employeeRepository;

    public PayrollStatusScheduler( HMS_TM_EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
//
//    @Scheduled(cron = "0 0/2 * * * ?")
//    @Transactional
//    public void resetPayrollStatus() {
//        employeeRepository.resetEmployeeStatus();
//    }
}



