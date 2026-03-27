package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.configuration.LoginManagementInterface;
import com.hms.services.adminmanagement.entity.HMS_TM_Department;
import com.hms.services.adminmanagement.entity.HMS_TM_Employee;
import com.hms.services.adminmanagement.entity.HMS_TW_Department;
import com.hms.services.adminmanagement.model.DepartmentHeadDTO;
import com.hms.services.adminmanagement.model.EmployeeLoginDTO;
import com.hms.services.adminmanagement.repository.HMS_TM_DepartmentRepository;
import com.hms.services.adminmanagement.repository.HMS_TM_EmployeeRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_DepartmentRepository;
import com.hms.services.adminmanagement.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    @Autowired
    private HMS_TM_DepartmentRepository tmDepartmentRepository;

    @Autowired
    private HMS_TW_DepartmentRepository twDepartmentRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private HMS_TM_EmployeeRepository tmEmployeeRepository;

    @Autowired
    private LoginManagementInterface loginInterface;

    public HMS_TW_Department createDepartment(HMS_TW_Department department) {
        return twDepartmentRepository.save(department);
    }

    public HMS_TW_Department getDepartmentById(String id) {
        return twDepartmentRepository.findByDepartmentIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<DepartmentHeadDTO> getAllDepartments() {
        List<HMS_TW_Department> departments=twDepartmentRepository.findByDeletedFalse();
        List<DepartmentHeadDTO> departmentHeadDTOs = new ArrayList<>();
        for (HMS_TW_Department department : departments) {
            DepartmentHeadDTO dto = new DepartmentHeadDTO();
            dto.setDepartmentId(department.getDepartmentId());
            dto.setName(department.getName());
            dto.setAuthStat(department.getAuthStat());
            dto.setRecordStat(department.getRecordStat());
            dto.setModNo(department.getModNo());
            dto.setDeleted(department.isDeleted());
            if (department.getEmployeeId() != null) {
                HMS_TM_Employee employeeOpt = tmEmployeeRepository.findByEmployeeId(department.getEmployeeId());
                if (employeeOpt!=null) {
                    dto.setEmployeeId(employeeOpt.getEmployeeId());
                    dto.setEmployeeFirstName(employeeOpt.getFirstName());
                    dto.setEmployeeLastName(employeeOpt.getLastName());
                }
            }
            departmentHeadDTOs.add(dto);
        }
        return departmentHeadDTOs;
    }

    public HMS_TW_Department updateDepartment(String id, HMS_TW_Department updatedDepartment) {
        HMS_TW_Department existingDepartment = getDepartmentById(id);
        existingDepartment.setName(updatedDepartment.getName());
        existingDepartment.setEmployeeId(updatedDepartment.getEmployeeId());
        existingDepartment.setModNo(updatedDepartment.getModNo());
        return twDepartmentRepository.save(existingDepartment);
    }

    public HMS_TM_Department approveDepartment(String id) {

        HMS_TW_Department department = getDepartmentById(id);

        if ("UNAUTHORIZED".equals(department.getAuthStat())) {
            HMS_TM_Department tmDepartment = new HMS_TM_Department();
            tmDepartment.setDepartmentId(department.getDepartmentId());
            tmDepartment.setEmployeeId(department.getEmployeeId());
            tmDepartment.setName(department.getName());
            tmDepartment.setModNo(department.getModNo());
            tmDepartment.setAuthStat("AUTHORIZED");

            tmDepartmentRepository.save(tmDepartment);

            department.setAuthStat("AUTHORIZED");
            department.setRecordStat("OPENED");
            twDepartmentRepository.save(department);
//            if(department.getEmployeeId()!=null){
//                HMS_TM_Employee employee=tmEmployeeRepository.findByEmployeeId(department.getEmployeeId());
//                EmployeeLoginDTO employeeLogin = new EmployeeLoginDTO();
//                employeeLogin.setEmployeeId(department.getEmployeeId());
//                employeeLogin.setDepartmentId(department.getDepartmentId());
//                employeeLogin.setFirstName(employee.getFirstName());
//                employeeLogin.setLastName(employee.getLastName());
//                employeeLogin.setRoleId(employee.getRoleId());
//                employeeLogin.setEmployeeId(employee.getEmployeeId());
//                employeeLogin.setEmail(employee.getEmail());
//                employeeLogin.setGender(employee.getGender());
//                employeeLogin.setPhone(employee.getPhone());
//                employeeLogin.setActive(true);
//                loginInterface.saveEmployee(employeeLogin);
//            }
            return tmDepartment;
        } else {
            throw new RuntimeException("Department is already approved or rejected");
        }
    }

    public void deleteDepartment(String id, String authStat) {
        HMS_TM_Department tmDepartment = tmDepartmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found in TM with id: " + id));

        if ("UNAUTHORIZED".equals(authStat)) {
//            EmployeeLoginDTO employeeLogin = new EmployeeLoginDTO();
//            HMS_TM_Employee employee=tmEmployeeRepository.findByEmployeeId(tmDepartment.getEmployeeId());
//            employeeLogin.setEmployeeId(employee.getEmployeeId());
//            employeeLogin.setDepartmentId(null);
//            employeeLogin.setFirstName(employee.getFirstName());
//            employeeLogin.setLastName(employee.getLastName());
//            employeeLogin.setRoleId(employee.getRoleId());
//            employeeLogin.setEmployeeId(employee.getEmployeeId());
//            employeeLogin.setEmail(employee.getEmail());
//            employeeLogin.setGender(employee.getGender());
//            employeeLogin.setPhone(employee.getPhone());
//            employeeLogin.setActive(true);
//            loginInterface.saveEmployee(employeeLogin);
            tmDepartmentRepository.delete(tmDepartment);
            Optional<HMS_TW_Department> twDepartmentOptional = twDepartmentRepository.findById(id);

            if (twDepartmentOptional.isPresent()) {
                HMS_TW_Department twDepartment = twDepartmentOptional.get();
                twDepartment.setAuthStat("UNAUTHORIZED");
                twDepartment.setRecordStat("CLOSED");
                twDepartmentRepository.save(twDepartment);
            }
        } else {
            throw new RuntimeException("Invalid authorization status, only UNAUTHORIZED is allowed");
        }
    }

    public List<DepartmentHeadDTO> getAllDepartmentsTm() {
        List<HMS_TM_Department> departments=tmDepartmentRepository.findAll();
        List<DepartmentHeadDTO> departmentHeadDTOs = new ArrayList<>();
        for (HMS_TM_Department department : departments) {
            DepartmentHeadDTO dto = new DepartmentHeadDTO();
            dto.setDepartmentId(department.getDepartmentId());
            dto.setName(department.getName());
            dto.setAuthStat(department.getAuthStat());
            dto.setRecordStat(department.getRecordStat());
            dto.setModNo(department.getModNo());
            if (department.getEmployeeId() != null) {
                HMS_TM_Employee employeeOpt = tmEmployeeRepository.findByEmployeeId(department.getEmployeeId());
                if (employeeOpt!=null) {
                    dto.setEmployeeId(employeeOpt.getEmployeeId());
                    dto.setEmployeeFirstName(employeeOpt.getFirstName());
                    dto.setEmployeeLastName(employeeOpt.getLastName());
                }
            }
            departmentHeadDTOs.add(dto);
        }
        return departmentHeadDTOs;
    }

    public HMS_TM_Department getDepartmentByIds(String id) {
        return tmDepartmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    public HMS_TM_Department updateDepartment(String id, HMS_TM_Department updatedDepartment) {
        HMS_TM_Department existingDepartment = getDepartmentByIds(id);
        existingDepartment.setName(updatedDepartment.getName());
        return tmDepartmentRepository.save(existingDepartment);
    }

    public void deleteTwDepartment(String id) {
        HMS_TW_Department department = twDepartmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
        department.setDeleted(true);
        twDepartmentRepository.save(department);
    }
}



