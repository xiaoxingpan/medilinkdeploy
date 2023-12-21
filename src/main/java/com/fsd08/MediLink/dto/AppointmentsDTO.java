package com.fsd08.MediLink.dto;

public interface AppointmentsDTO {

    Integer getId();

    Integer getPatientId();

    Integer getDoctorScheduleId();

    String getStatus();

    String getPaymentReference();

    String getMedicalRecord();

    String getPrescription();

    Integer getRate();

    String getComment();

    String getDoctorId();

    String getDate();

    String getDoctorName();

    String getPatientName();

    String getDepartmentName();

}
