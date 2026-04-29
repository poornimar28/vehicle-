package com.AutoServix.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "service_records")
public class ServiceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(length = 1000)
    private String faults;

    @Column(length = 1000)
    private String notes;

    private Double cost;

    @Column(nullable = false)
    private String healthStatus; // Good, Moderate, Poor

    private String mechanicName;

    private Integer rating;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id", nullable = false)
    @JsonIgnoreProperties({"customer"})
    private Vehicle vehicle;

    public ServiceRecord() {}

    public ServiceRecord(LocalDate date, String faults, String notes, Double cost, String healthStatus, String mechanicName, Integer rating, Vehicle vehicle) {
        this.date = date;
        this.faults = faults;
        this.notes = notes;
        this.cost = cost;
        this.healthStatus = healthStatus;
        this.mechanicName = mechanicName;
        this.rating = rating;
        this.vehicle = vehicle;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getFaults() { return faults; }
    public void setFaults(String faults) { this.faults = faults; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }
    public String getHealthStatus() { return healthStatus; }
    public void setHealthStatus(String healthStatus) { this.healthStatus = healthStatus; }
    public String getMechanicName() { return mechanicName; }
    public void setMechanicName(String mechanicName) { this.mechanicName = mechanicName; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
}
