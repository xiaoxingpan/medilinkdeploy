package com.fsd08.MediLink.service.impl;

import com.fsd08.MediLink.dto.AppointmentsDTO;
import com.fsd08.MediLink.dto.BaseResult;
import com.fsd08.MediLink.dto.ScheduleDTO;
import com.fsd08.MediLink.entity.Appointment;
import com.fsd08.MediLink.entity.Doctor_schedule;
import com.fsd08.MediLink.entity.Schedule;
import com.fsd08.MediLink.repository.AppointmentRepository;
import com.fsd08.MediLink.repository.Doctor_scheduleRepository;
import com.fsd08.MediLink.repository.ScheduleRepository;
import com.fsd08.MediLink.service.AppointmentsService;
import jakarta.annotation.Resource;
import jakarta.persistence.Tuple;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

@Service
public class AppointmentsServiceImpl implements AppointmentsService {

    @Resource
    private AppointmentRepository appointmentRepository;
    @Resource
    private Doctor_scheduleRepository doctorScheduleRepository;
    @Resource
    private ScheduleRepository scheduleRepository;

    @Override
    public Page<AppointmentsDTO> page(int pageSize, int pageNumber, String patientId) {
        PageRequest page = PageRequest.of(pageNumber, pageSize, Sort.Direction.DESC, "ds.date");
        return appointmentRepository.findPage(page, patientId);
    }

    @Override
    public void review(Appointment appointment) {
        Appointment exist = appointmentRepository.getReferenceById(appointment.getId());
        exist.setComment(appointment.getComment());
        exist.setRate(appointment.getRate());
        appointmentRepository.save(exist);
    }

    @Transactional
    @Override
    public void setDefaultReview() {
        appointmentRepository.setDefaultReview(5);
    }

    @Transactional
    @Override
    public BaseResult<?> schedule(ScheduleDTO param) {
        Doctor_schedule scheduled = doctorScheduleRepository.findBySchedule(param.getDoctorId(), param.getDate(), param.getStartTime());
        if (Objects.nonNull(scheduled)) {
            return BaseResult.error("The doctor has already made an appointment");
        }

        Schedule schedule = new Schedule();
        LocalTime startTime = LocalTime.parse(param.getStartTime());
        schedule.setStart_time(Time.valueOf(startTime));
        schedule.setEnd_time(Time.valueOf(startTime.plusHours(1)));
        schedule = scheduleRepository.save(schedule);

        Doctor_schedule doctorSchedule = new Doctor_schedule();
        doctorSchedule.setSchedule_id(schedule.getId());
        doctorSchedule.setDoctor_id(param.getDoctorId());
        doctorSchedule.setDate(Date.valueOf(param.getDate()));
        doctorSchedule = doctorScheduleRepository.save(doctorSchedule);

        Appointment appointment = new Appointment();
        appointment.setDoctor_schedule_id(doctorSchedule.getId());
        appointment.setPatient_id(param.getPatientId());
        appointment.setStatus(Appointment.Appointment_Status.CONFIRMED);
        appointment.setType(param.getType());
        appointmentRepository.save(appointment);

        return BaseResult.ok("The appointment was successful");
    }

    @Override
    public List<Appointment> findByPatientId(int id) {
        return appointmentRepository.findByPatient_id(id);
    }
}
