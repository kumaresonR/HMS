package com.hms.services.patientmanagement.controller;

import com.hms.services.patientmanagement.model.AppointmentsDTO;
import com.hms.services.patientmanagement.model.AppointmentsDetails;
import com.hms.services.patientmanagement.response.ApiResponse;
import com.hms.services.patientmanagement.response.AppointmentsResponse;
import com.hms.services.patientmanagement.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


@RestController
@RequestMapping("/appointment")
public class AppointmentController{

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(final AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }


    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createAppointment(@Valid @RequestBody AppointmentsDTO appointments) {
        ApiResponse createdAppointment = appointmentService.createAppointment(appointments);
        return ResponseEntity.status(201).body(createdAppointment);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteAppointmentById(@PathVariable("id") String appointmentId) {
        ApiResponse appointment=appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.ok(appointment);
    }


    @GetMapping("/all")
    public ResponseEntity<List<AppointmentsDetails>> getAllAppointments(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        List<AppointmentsDetails> getAppointment = appointmentService.getAllAppointments(page,size);
        return ResponseEntity.ok(getAppointment);
    }


    @GetMapping("/{id}")
    public ResponseEntity<AppointmentsDetails> getAppointmentById(@PathVariable("id") String appointmentId) {
        AppointmentsDetails getAppointment = appointmentService.getAppointments(appointmentId);
        return ResponseEntity.ok(getAppointment);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<AppointmentsDTO> updateAppointmentById(@PathVariable("id") String appointmentId, @Valid @RequestBody AppointmentsDTO appointments) {
        AppointmentsDTO updateAppointment = appointmentService.updateAppointments(appointmentId,appointments);
        return ResponseEntity.ok(updateAppointment);
    }


    @GetMapping("/filterAppointments")
    public ResponseEntity<List<AppointmentsResponse>> getIndividualAppointments(
            @RequestParam(required = false) String patientId,
            @RequestParam (required = false) String appointmentDate,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String appointmentId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<AppointmentsResponse> patient = appointmentService.getIndividualAppointments(patientId, appointmentDate, doctorId, appointmentId,status,page,size);
        if (patient != null) {
            return ResponseEntity.ok(patient);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/filterAppointments/download")
    public ResponseEntity<Resource> downloadAppointmentsExcel(
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String appointmentDate,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) throws IOException {

        List<AppointmentsResponse> appointments = appointmentService.getIndividualAppointmentsFilter(
                patientId, appointmentDate, doctorId, status,timeDuration,fromDate,toDate
        );

        ByteArrayInputStream in = generateExcel(appointments);
        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=appointments.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }



    @GetMapping("/filter/appointments")
    public ResponseEntity<List<AppointmentsResponse>> filterAppointments(
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String appointmentDate,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String timeDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ){
        List<AppointmentsResponse> appointments = appointmentService.getIndividualAppointmentsFilter(
                patientId, appointmentDate, doctorId, status,timeDuration,fromDate,toDate);
        return ResponseEntity.ok(appointments);
    }


    private ByteArrayInputStream generateExcel(List<AppointmentsResponse> appointments) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Appointments");
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Appointment Date");
            headerRow.createCell(1).setCellValue("Patient Name");
            headerRow.createCell(2).setCellValue("Age");
            headerRow.createCell(3).setCellValue("Gender");
            headerRow.createCell(4).setCellValue("Mobile Number");
            headerRow.createCell(5).setCellValue("Doctor Name");
            headerRow.createCell(6).setCellValue("Registration Fees");
            headerRow.createCell(7).setCellValue("Reason For Visit");
            headerRow.createCell(8).setCellValue("Status");
            int rowIdx = 1;
            for (AppointmentsResponse appointment : appointments) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(appointment.getAppointmentDate().toString());
                row.createCell(1).setCellValue(appointment.getPatients().getFirstName()+" "+appointment.getPatients().getLastName()+" "+(appointment.getPatients().getPatientId()));
                row.createCell(2).setCellValue(appointment.getPatients().getAge());
                row.createCell(3).setCellValue(appointment.getPatients().getGender());
                row.createCell(4).setCellValue(appointment.getPatients().getContactNumber());
                if(appointment.getDoctor()!=null) {
                    row.createCell(5).setCellValue(appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName() + " " + (appointment.getDoctor().getStaffId()));
                }
                row.createCell(6).setCellValue(appointment.getRegistrationFees());
                row.createCell(7).setCellValue(appointment.getReasonForVisit());
                row.createCell(8).setCellValue(appointment.getStatus());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


}

