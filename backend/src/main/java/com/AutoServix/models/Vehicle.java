package com.AutoServix.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false, unique = true)
    private String modelNumber; // License Plate

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false, unique = true)
    private String chassisNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnoreProperties({"password", "vehicles", "appointments", "serviceRecords"})
    private Customer customer;

    public Vehicle() {}

    public Vehicle(String make, String model, String modelNumber, Integer year, String chassisNumber, Customer customer) {
        this.make = make;
        this.model = model;
        this.modelNumber = modelNumber;
        this.year = year;
        this.chassisNumber = chassisNumber;
        this.customer = customer;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getModelNumber() { return modelNumber; }
    public void setModelNumber(String modelNumber) { this.modelNumber = modelNumber; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getChassisNumber() { return chassisNumber; }
    public void setChassisNumber(String chassisNumber) { this.chassisNumber = chassisNumber; }
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
}
