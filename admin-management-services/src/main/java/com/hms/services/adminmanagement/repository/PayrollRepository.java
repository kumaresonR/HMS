package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Payroll;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PayrollRepository extends CrudRepository<HMS_TM_Payroll, String> {

    @Modifying
    @Query("UPDATE HMS_TM_Payroll p SET p.status = 'Not Generated'")
    void resetPayrollStatusMonthly();

//    List<HMS_TM_Payroll> findByEmployeeIdAndMonthAndYear(String employeeId, String month, int year);

    @Query("SELECT p FROM HMS_TM_Payroll p WHERE p.employeeId = :employeeId AND p.month = :month AND p.year = :year")
    List<HMS_TM_Payroll> findByEmployeeIdAndMonthAndYear(
            @Param("employeeId") String employeeId,
            @Param("month") String month,
            @Param("year") Integer year
    );

    List<HMS_TM_Payroll> findByEmployeeId(String id);

//    @Query("SELECT p FROM HMS_TM_Payroll p WHERE p.status = 'Paid'")
//    List<HMS_TM_Payroll> findByStatus(String status);

    List<HMS_TM_Payroll> findByStatusAndEmployeeId(String paid, String employeeId);


    @Query("SELECT p FROM HMS_TM_Payroll p WHERE p.employeeId = :employeeId AND p.month BETWEEN :fromMonth AND :toMonth AND p.year = :year")
    List<HMS_TM_Payroll> findByEmployeeIdAndMonthRange(@Param("employeeId") String employeeId,
                                                       @Param("fromMonth") String fromMonth,
                                                       @Param("toMonth") String toMonth,
                                                       @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_Payroll p WHERE p.employeeId = :employeeId AND p.month = :month AND p.year = :year")
    List<HMS_TM_Payroll> findByEmployeeIdAndSingleMonth(@Param("employeeId") String employeeId,
                                                        @Param("month") String month,
                                                        @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_Payroll p WHERE p.employeeId = :employeeId AND p.year = :year")
    List<HMS_TM_Payroll> findByEmployeeIdAndYear(@Param("employeeId") String employeeId,
                                                 @Param("year") int year);


}



