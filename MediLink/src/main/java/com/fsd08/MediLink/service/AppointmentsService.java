package com.fsd08.MediLink.service;


import com.fsd08.MediLink.dto.AppointmentsDTO;
import com.fsd08.MediLink.dto.BaseResult;
import com.fsd08.MediLink.dto.ScheduleDTO;
import com.fsd08.MediLink.entity.Appointment;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AppointmentsService {

    Page<AppointmentsDTO> page(int pageSize, int pageNumber, String patientId);

    void review(Appointment appointment);

    void setDefaultReview();

    BaseResult<?> schedule(ScheduleDTO param);

    List<Appointment> findByPatientId(int id);

}
