package com.AutoServix.dto;

public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private String modelNo;
    private String brand;
    private Integer chassisNo;

    // REQUIRED
    public RegisterRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getModelNo() {
        return modelNo;
    }

    public void setModelNo(String modelNo) {
        this.modelNo = modelNo;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Integer getChassisNo() {
        return chassisNo;
    }

    public void setChassisNo(Integer chassisNo) {
        this.chassisNo = chassisNo;
    }
}