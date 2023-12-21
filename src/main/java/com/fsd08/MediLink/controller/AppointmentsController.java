package com.fsd08.MediLink.controller;

import com.fsd08.MediLink.dto.AppointmentsDTO;
import com.fsd08.MediLink.dto.BaseResult;
import com.fsd08.MediLink.dto.ScheduleDTO;
import com.fsd08.MediLink.entity.Appointment;
import com.fsd08.MediLink.entity.User;
import com.fsd08.MediLink.repository.AppointmentRepository;
import com.fsd08.MediLink.service.AppointmentsService;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/appointments")
@RestController
public class AppointmentsController {

    @Resource
    private AppointmentsService appointmentsService;

    @GetMapping("/page")
    public Page<AppointmentsDTO> page(int pageSize, int pageNumber, String patientId) {
        return appointmentsService.page(pageSize, pageNumber, patientId);
    }

    @PostMapping("/review")
    public void review(@RequestBody Appointment appointment) {
        appointmentsService.review(appointment);
    }

    @PostMapping("/schedule")
    public BaseResult<?> schedule(@RequestBody ScheduleDTO param) {
        return appointmentsService.schedule(param);
    }

    @GetMapping("/getAppointments/{id}")
    public List<Appointment> getAppointmentsById(@PathVariable int id) {
        List<Appointment> appointments = appointmentsService.findByPatientId(id);
        return appointments;
    }


}
