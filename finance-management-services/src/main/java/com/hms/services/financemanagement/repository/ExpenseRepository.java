package com.hms.services.financemanagement.repository;

import com.hms.services.financemanagement.entity.HMS_TM_Expense;
import com.hms.services.financemanagement.entity.HMS_TM_Income;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<HMS_TM_Expense, String> {

    List<HMS_TM_Expense> findByIsDeletedFalse();

    Optional<HMS_TM_Expense> findByExpenseIdAndIsDeletedFalse(String expenseId);
    //@Query("SELECT SUM(p.amount) FROM HMS_TM_Expense p WHERE p.isDeleted = false")
//    @Query("SELECT SUM(p.amount) FROM HMS_TM_Expense p WHERE p.isDeleted = false")
    @Query("SELECT SUM(p.amount) FROM HMS_TM_Expense p " +
        "WHERE p.isDeleted = false AND FUNCTION('DATE', p.date) = CURRENT_DATE")
    Double getTotalExpenseAmount();
    @Query("SELECT SUM(p.amount) FROM HMS_TM_Expense p " +
            "WHERE p.isDeleted = false AND FUNCTION('DATE', p.date) = :yesterday")
    Double getYesterdayExpenseAmount(@Param("yesterday") LocalDate yesterday);

    @Query("SELECT SUM(p.amount) FROM HMS_TM_Expense p " +
            "WHERE p.isDeleted = false " +
            "AND EXTRACT(MONTH FROM p.date) = EXTRACT(MONTH FROM CURRENT_DATE) " +
            "AND EXTRACT(YEAR FROM p.date) = EXTRACT(YEAR FROM CURRENT_DATE)")
    Double getMonthlyTotalExpenseAmount();


    @Query("SELECT EXTRACT(MONTH FROM p.date) AS month, SUM(p.amount) AS total FROM HMS_TM_Expense p " +
            "WHERE p.isDeleted = false " +
            "AND EXTRACT(YEAR FROM p.date) = EXTRACT(YEAR FROM CURRENT_DATE) " +
            "GROUP BY EXTRACT(MONTH FROM p.date)")
    List<Object[]> getMonthlyExpenseForYear();

    @Query("SELECT SUM(p.amount) FROM HMS_TM_Expense p " +
            "WHERE p.isDeleted = false AND EXTRACT(YEAR FROM p.date) = :year")
    Double getYearlyExpenseAmount(@Param("year") int year);

    @Query("SELECT SUM(p.amount) FROM HMS_TM_Expense p " +
            "WHERE p.isDeleted = false AND EXTRACT(MONTH FROM p.date) = :month " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    Double getMonthlyExpenseAmount(@Param("month") int month, @Param("year") int year);


    @Query("SELECT SUM(p.amount) FROM HMS_TM_Expense p " +
            "WHERE p.isDeleted = false AND EXTRACT(WEEK FROM p.date) = :week " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    Double getWeeklyExpenseAmount(@Param("week") int week, @Param("year") int year);


    @Query("SELECT p FROM HMS_TM_Expense p " +
            "WHERE p.isDeleted = false " +
            "AND FUNCTION('DATE', p.date) = CURRENT_DATE")
    List<HMS_TM_Expense> getAllExpensesForToday();

    @Query("SELECT p FROM HMS_TM_Expense p " +
            "WHERE p.isDeleted = false " +
            "AND EXTRACT(MONTH FROM p.date) = :month " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_Expense> getAllExpensesForCurrentMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM HMS_TM_Expense p " +
            "WHERE p.isDeleted = false " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_Expense> getAllExpensesForCurrentYear(@Param("year") int year);

    @Query("SELECT p FROM HMS_TM_Expense p " +
            "WHERE p.isDeleted = false " +
            "AND EXTRACT(WEEK FROM p.date) = :week " +
            "AND EXTRACT(YEAR FROM p.date) = :year")
    List<HMS_TM_Expense> getAllExpensesForCurrentWeek(@Param("week") int week, @Param("year") int year);

    @Query("SELECT d FROM HMS_TM_Expense d WHERE d.date BETWEEN :fromDate AND :toDate")
    Page<HMS_TM_Expense> findExpenseByDateRange(@Param("fromDate") LocalDateTime fromDate,
                                              @Param("toDate") LocalDateTime toDate,
                                              Pageable pageable);

    @Query("SELECT COUNT(d) FROM HMS_TM_Expense d WHERE d.date BETWEEN :fromDate AND :toDate")
    long countByDateRange(@Param("fromDate") LocalDateTime fromDate,
                          @Param("toDate") LocalDateTime toDate);

    @Query(value = "SELECT \"EXPENSE_ID\", \"NAME\", \"INVOICE_NUMBER\", \"DATE\", \"DESCRIPTION\", \"EXPENSE_HEAD\", \"AMOUNT\" " +
            "FROM \"HMS_TM_EXPENSE\" " +
            "WHERE CAST(\"DATE\" AS DATE) BETWEEN :fromDate AND :toDate", nativeQuery = true)
    List<Object[]> findExpenseAsRawData(@Param("fromDate") LocalDate fromDate,
                                       @Param("toDate") LocalDate toDate);
}



