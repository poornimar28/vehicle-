package com.AutoServix.dto;

import java.time.LocalDate;

public class AppointmentRequest {
    private Integer vehicleId;
    private LocalDate date;
    private String timeSlot;
    private String notes;

    public Integer getVehicleId() { return vehicleId; }
    public void setVehicleId(Integer vehicleId) { this.vehicleId = vehicleId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
