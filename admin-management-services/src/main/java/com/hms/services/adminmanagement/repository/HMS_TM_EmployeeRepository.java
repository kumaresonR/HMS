package com.hms.services.adminmanagement.repository;


import com.hms.services.adminmanagement.entity.HMS_TM_Employee;
import com.hms.services.adminmanagement.model.EmployeeMinimalDTO;
import com.hms.services.adminmanagement.model.EmployeeRoleDTO;
import com.hms.services.adminmanagement.model.SearchEmployeeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface HMS_TM_EmployeeRepository extends JpaRepository<HMS_TM_Employee, String > {

    List<HMS_TM_Employee> findByRoleId(String roleId);

    @Query("SELECT new com.hms.services.adminmanagement.model.SearchEmployeeDTO(e.employeeId, e.staffId, CONCAT(e.firstName, ' ', e.lastName)) " +
            "FROM HMS_TM_Employee e " +
            "LEFT JOIN HMS_TM_Role r ON e.roleId = r.roleId " +
            "WHERE (LOWER(r.roleName) LIKE LOWER(CONCAT('%', :role, '%')) OR :role IS NULL) " +
            "AND (LOWER(e.departmentId) LIKE LOWER(CONCAT('%', :department, '%')) OR :department IS NULL) " +
            "AND ((LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) OR :searchTerm IS NULL) " +
            "AND (LOWER(e.staffId) LIKE LOWER(CONCAT('%', :staffId, '%')) OR :staffId IS NULL)")
    List<SearchEmployeeDTO> findEmployeesBySearchTerm(
            @Param("role") String role,
            @Param("department") String department,
            @Param("searchTerm") String searchTerm,
            @Param("staffId") String staffId
    );

    List<HMS_TM_Employee> findEmployeesByRoleId(String roleId);

    List<HMS_TM_Employee> findAll();

    HMS_TM_Employee findByEmployeeId(String employeeId);

    Optional<HMS_TM_Employee> findByStaffId(String staffId);


//    List<HMS_TM_Employee> findByDepartmentId(String departmentId);

    List<HMS_TM_Employee> findByReporterId(String approverId);


    @Query("SELECT new com.hms.services.adminmanagement.model.EmployeeRoleDTO(e.firstName, e.lastName,e.staffId,e.phone,r.roleName) " +
            "FROM HMS_TM_Employee e " +
            "LEFT JOIN HMS_TM_Role r ON e.roleId = r.roleId " +
            "WHERE (:roles IS NULL OR LOWER(r.roleName) LIKE LOWER(CONCAT('%', :roles, '%'))) " +
            "AND ((LOWER(e.firstName) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :name, '%'))) OR :name IS NULL)")
    List<EmployeeRoleDTO> searchByRoleAndName(
            @Param("roles") String roles,
            @Param("name") String name
    );

    @Query("SELECT new com.hms.services.adminmanagement.model.EmployeeMinimalDTO(" +
            "e.employeeId, e.staffId, e.firstName, e.lastName, e.reporterId, e.password, e.gender, e.dateOfBirth, e.dateOfJoining, " +
            "e.email, e.phone, e.maritalStatus, e.designation, e.roleId, e.doctorFee, e.departmentId, e.fatherName, e.motherName, " +
            "e.bloodGroup, e.nationalIdNumber, e.panNumber, e.localIdNumber, e.specialist, e.referenceContact, e.qualification, " +
            "e.currentAddress, e.permanentAddress, e.workExperience, e.specialization, e.note, " +
            "e.epfNumber, e.basicSalary, e.contractType, e.workShift, e.workLocation, " +
            "e.casualLeave, e.privilegeLeave, e.sickLeave, e.maternityLeave, e.paternityLeave, e.feverLeave, e.lop, " +
            "e.accountTitle, e.bankAccountNo, e.bankName, e.ifscCode, e.bankBranchName) " +
            "FROM HMS_TM_Employee e WHERE e.roleId = :roleId")
    Page<EmployeeMinimalDTO> findMinimalByRoleId(@Param("roleId") String roleId, Pageable pageable);



    @Query("SELECT new com.hms.services.adminmanagement.model.EmployeeMinimalDTO(" +
            "e.employeeId, e.staffId, e.firstName, e.lastName, e.reporterId, e.password, e.gender, e.dateOfBirth, e.dateOfJoining, " +
            "e.email, e.phone, e.maritalStatus, e.designation, e.roleId, e.doctorFee, e.departmentId, e.fatherName, e.motherName, " +
            "e.bloodGroup, e.nationalIdNumber, e.panNumber, e.localIdNumber, e.specialist, e.referenceContact, e.qualification, " +
            "e.currentAddress, e.permanentAddress, e.workExperience, e.specialization, e.note, " +
            "e.epfNumber, e.basicSalary, e.contractType, e.workShift, e.workLocation, " +
            "e.casualLeave, e.privilegeLeave, e.sickLeave, e.maternityLeave, e.paternityLeave, e.feverLeave, e.lop, " +
            "e.accountTitle, e.bankAccountNo, e.bankName, e.ifscCode, e.bankBranchName) " +
            "FROM HMS_TM_Employee e " +
            "WHERE (:roleId IS NULL OR e.roleId = :roleId) " +
            "AND (:staffId IS NULL OR e.staffId = :staffId)")
    Page<EmployeeMinimalDTO> findMinimalByRoleIdAndNameLike(
            @Param("roleId") String roleId,
            @Param("staffId") String staffId,
            Pageable pageable);


    @Query("SELECT e FROM HMS_TM_Employee e " +
            "WHERE (:roleId IS NULL OR e.roleId = :roleId) " +
            "AND (:staffId IS NULL OR e.staffId = :staffId)")
    List<HMS_TM_Employee> findByRoleAndStaffId(
            @Param("roleId") String roleId,
            @Param("staffId") String staffId
    );







//    @Query("SELECT e FROM HMS_TM_Employee e WHERE " +
//            "e.roleId = :roleId AND " +
//            "(LOWER(e.firstName) LIKE LOWER(CONCAT('%', :name, '%')) " +
//            "OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :name, '%')))")
//    List<HMS_TM_Employee> findByOptionalCriteria(@Param("roleId") String roleId, @Param("name") String name);



}



