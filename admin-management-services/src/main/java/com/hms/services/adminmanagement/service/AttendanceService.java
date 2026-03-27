package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_AttendanceLeave;
import com.hms.services.adminmanagement.entity.HMS_TM_Employee;
import com.hms.services.adminmanagement.entity.HMS_TM_Role;
import com.hms.services.adminmanagement.model.AttendanceUpdateDTO;
import com.hms.services.adminmanagement.model.RolesDTO;
import com.hms.services.adminmanagement.repository.AttendanceRepository;
import com.hms.services.adminmanagement.repository.HMS_TM_EmployeeRepository;
import com.hms.services.adminmanagement.repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    @Autowired
    private HMS_TM_EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private RoleRepository roleRepository;

//    @Transactional
//    public List<AttendanceUpdateDTO> getEmployeesByRoleAndDate(String roleId, String attendanceDate) {
//        List<HMS_TM_Employee> employees;
//
//        if (roleId != null && !roleId.isEmpty()) {
//            employees = employeeRepository.findByRoleId(roleId);
//        } else {
//            employees = employeeRepository.findAll();
//        }
//
//        List<AttendanceUpdateDTO> responseList = new ArrayList<>();
//        LocalDate currentDate = (attendanceDate != null && !attendanceDate.isEmpty())
//                ? LocalDate.parse(attendanceDate)
//                : LocalDate.now();
//
//        for (HMS_TM_Employee employee : employees) {
//            List<AttendanceUpdateDTO> employeeAttendanceList = new ArrayList<>();
//
//            List<HMS_TM_AttendanceLeave> attendanceLeaves = attendanceRepository
//                    .findByStaffIdAndAttendanceDate(employee.getStaffId(), LocalDate.from(currentDate.atStartOfDay()));  // set time to midnight
//
//            if (attendanceLeaves.isEmpty()) {
//                AttendanceUpdateDTO response = new AttendanceUpdateDTO();
//                response.setStaffId(employee.getStaffId());
//                response.setName(employee.getFirstName() + " " + employee.getLastName());
//                response.setRoleId(employee.getRoleId());
//                response.setStaffAttendance("");
//                response.setEntryTime(null);
//                response.setExitTime(null);
//                response.setAttendanceDate(currentDate);
//                response.setNotes("");
//                employeeAttendanceList.add(response);
//            }
//
//            for (HMS_TM_AttendanceLeave attendance : attendanceLeaves) {
//                AttendanceUpdateDTO response = new AttendanceUpdateDTO();
//                response.setStaffId(employee.getStaffId());
//                response.setName(employee.getFirstName() + " " + employee.getLastName());
//                response.setRoleId(employee.getRoleId());
//                response.setStaffAttendance(attendance.getStaffAttendance());
//                response.setEntryTime(attendance.getEntryTime());
//                response.setExitTime(attendance.getExitTime());
//                response.setAttendanceDate(currentDate);
//                response.setNotes(attendance.getNotes());
//
//                employeeAttendanceList.add(response);
//            }
//
//            responseList.addAll(employeeAttendanceList);
//        }
//
//        return responseList;
//    }

    @Transactional
    public List<AttendanceUpdateDTO> getEmployeesByRoleAndDate(String roleId, String attendanceDate) {
        List<HMS_TM_Employee> employees;

        if (roleId != null && !roleId.isEmpty()) {
            employees = employeeRepository.findByRoleId(roleId);
        } else {
            employees = employeeRepository.findAll();
        }

        List<AttendanceUpdateDTO> responseList = new ArrayList<>();
        LocalDate currentDate = (attendanceDate != null && !attendanceDate.isEmpty())
                ? LocalDate.parse(attendanceDate)
                : LocalDate.now();

        for (HMS_TM_Employee employee : employees) {
            List<AttendanceUpdateDTO> employeeAttendanceList = new ArrayList<>();

            Optional<HMS_TM_Role> roleOptional = roleRepository.findById(employee.getRoleId());
            RolesDTO rolesDTO = roleOptional.map(role -> {
                RolesDTO dto = new RolesDTO();
                dto.setRoleId(role.getRoleId());
                dto.setRoleName(role.getRoleName());
                return dto;
            }).orElse(null);

            List<HMS_TM_AttendanceLeave> attendanceLeaves = attendanceRepository
                    .findByStaffIdAndAttendanceDate(employee.getStaffId(), currentDate);

            if (attendanceLeaves.isEmpty()) {
                AttendanceUpdateDTO response = new AttendanceUpdateDTO();
                response.setAttendanceId(null);
                response.setStaffId(employee.getStaffId());
                response.setName(employee.getFirstName() + " " + employee.getLastName());
                response.setRoleId(employee.getRoleId());
                response.setStaffAttendance("");
                response.setEntryTime(null);
                response.setExitTime(null);
                response.setAttendanceDate(currentDate);
                response.setNotes("");

                if (rolesDTO != null) {
                    response.setRoleName(rolesDTO.getRoleName());
                }

                employeeAttendanceList.add(response);
            }

            for (HMS_TM_AttendanceLeave attendance : attendanceLeaves) {
                AttendanceUpdateDTO response = new AttendanceUpdateDTO();
                response.setAttendanceId(attendance.getAttendanceId());
                response.setStaffId(employee.getStaffId());
                response.setName(employee.getFirstName() + " " + employee.getLastName());
                response.setRoleId(employee.getRoleId());
                response.setStaffAttendance(attendance.getStaffAttendance());
                response.setEntryTime(attendance.getEntryTime());
                response.setExitTime(attendance.getExitTime());
                response.setAttendanceDate(currentDate);
                response.setNotes(attendance.getNotes());

                if (rolesDTO != null) {
                    response.setRoleName(rolesDTO.getRoleName());
                }

                employeeAttendanceList.add(response);
            }

            responseList.addAll(employeeAttendanceList);
        }

        return responseList;
    }

    public List<HMS_TM_AttendanceLeave> saveAttendance(List<HMS_TM_AttendanceLeave> attendanceRequests, String roleId, String attendanceType) {
        List<HMS_TM_AttendanceLeave> attendanceList = new ArrayList<>();

        for (HMS_TM_AttendanceLeave request : attendanceRequests) {
            HMS_TM_AttendanceLeave attendance =new HMS_TM_AttendanceLeave();
            attendance.setStaffId(request.getStaffId());
            attendance.setName(request.getName());
            attendance.setRoleId(request.getRoleId() != null ? request.getRoleId() : roleId);

            if (request.getStaffAttendance() != null) {
                attendance.setStaffAttendance(request.getStaffAttendance());
            } else {
                attendance.setStaffAttendance(attendanceType);
            }

            attendance.setEntryTime(request.getEntryTime());
            attendance.setExitTime(request.getExitTime());
            attendance.setNotes(request.getNotes());
            attendance.setAttendanceDate(request.getAttendanceDate());
            attendance.setYear(String.valueOf(request.getAttendanceDate().getYear()));
            attendance.setMonth(String.valueOf(request.getAttendanceDate().getMonth()));
            attendanceList.add(attendance);

        }

        return attendanceRepository.saveAll(attendanceList);
    }

    public List<HMS_TM_AttendanceLeave> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public HMS_TM_AttendanceLeave getAttendanceById(String id) {
        return attendanceRepository.findById(id).orElse(null);
    }

    public List<HMS_TM_AttendanceLeave> updateAttendance(List<HMS_TM_AttendanceLeave> attendanceRequests) {
        List<HMS_TM_AttendanceLeave> updatedAttendances = new ArrayList<>();

        for (HMS_TM_AttendanceLeave attendanceRequest : attendanceRequests) {
            Optional<HMS_TM_AttendanceLeave> existingAttendance = attendanceRepository
                    .findById(attendanceRequest.getAttendanceId());

            if (existingAttendance.isPresent()) {
                HMS_TM_AttendanceLeave attendance = existingAttendance.get();
                attendance.setStaffId(attendanceRequest.getStaffId());
                attendance.setName(attendanceRequest.getName());
                attendance.setRoleId(attendanceRequest.getRoleId());
                attendance.setStaffAttendance(attendanceRequest.getStaffAttendance());
                attendance.setEntryTime(attendanceRequest.getEntryTime());
                attendance.setExitTime(attendanceRequest.getExitTime());
                attendance.setNotes(attendanceRequest.getNotes());
                attendance.setAttendanceDate(attendanceRequest.getAttendanceDate());
                updatedAttendances.add(attendanceRepository.save(attendance));
            } else {
                HMS_TM_AttendanceLeave newAttendance = new HMS_TM_AttendanceLeave();
                newAttendance.setStaffId(attendanceRequest.getStaffId());
                newAttendance.setName(attendanceRequest.getName());
                newAttendance.setRoleId(attendanceRequest.getRoleId());
                newAttendance.setStaffAttendance(attendanceRequest.getStaffAttendance());
                newAttendance.setEntryTime(attendanceRequest.getEntryTime());
                newAttendance.setExitTime(attendanceRequest.getExitTime());
                newAttendance.setNotes(attendanceRequest.getNotes());
                newAttendance.setAttendanceDate(attendanceRequest.getAttendanceDate());
                updatedAttendances.add(attendanceRepository.save(newAttendance));
            }
        }

        return updatedAttendances;
    }
}




