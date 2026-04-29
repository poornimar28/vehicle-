package com.AutoServix.dto;

public class VehicleRequest {
    private String make;
    private String model;
    private String modelNumber;
    private Integer year;
    private String chassisNumber;

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
}
