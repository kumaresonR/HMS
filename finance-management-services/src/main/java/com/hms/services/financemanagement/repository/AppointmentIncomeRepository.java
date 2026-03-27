package com.hms.services.financemanagement.repository;

import com.hms.services.financemanagement.entity.HMS_TM_AppointmentIncome;
import com.hms.services.financemanagement.entity.HMS_TM_Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentIncomeRepository extends JpaRepository<HMS_TM_AppointmentIncome, String> {
}


