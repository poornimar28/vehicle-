package com.AutoServix.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mechanic")
public class Mechanic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mechId;

    @Column(name = "mechName", nullable = false)
    private String mechName;
    private String mechDescription;

    @ManyToOne
    @JoinColumn(name = "customer_Id")  // its a foreign key
    private Customer customer;

    @ElementCollection
    @CollectionTable(name = "mechanic_faults", joinColumns = @JoinColumn(name = "mech_id"))
    @Column(name = "fault")
    private List<String> fault = new ArrayList<>();
    private int noOfServices;

    public Mechanic() {}

    public Mechanic(String mechName, String mechDescription, Customer customer,  ArrayList<String> fault, int noOfServices) {
        this.mechName = mechName;
        this.mechDescription = mechDescription;
        this.customer = customer;
        this.fault = fault;
        this.noOfServices = noOfServices;
    }

    public Integer getMechId() { return mechId; }
    public void setMechId(Integer mechId) { this.mechId = mechId; }

    public String getMechName() { return mechName; }
    public void setMechName(String mechName) { this.mechName = mechName; }

    public String getMechDescription() { return mechDescription; }
    public void setMechDescription(String mechDescription) { this.mechDescription = mechDescription; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public List<String> getFault() { return fault; }
    public void setFault(List<String> fault) { this.fault = fault; }

    public int getNoOfServices() { return noOfServices; }
    public void setNoOfServices(int noOfServices) { this.noOfServices = noOfServices; }
}
