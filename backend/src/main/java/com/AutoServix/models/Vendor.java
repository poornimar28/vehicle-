package com.AutoServix.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="vendor")
public class Vendor {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer serviceid;

    @ManyToOne
    @JoinColumn(name="Customer_Id", nullable=false)
    private Customer customer;
    private String AISummary;
    private Integer Health;

    @ManyToOne
    @JoinColumn(name="Mechanic_Id", nullable=false)
    private Mechanic mechanic;

    public Integer getServiceid() {
        return serviceid;
    }


    public void setServiceid(Integer serviceid) {
        this.serviceid = serviceid;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public String getAISummary() {
        return AISummary;
    }

    public void setAISummary(String aISummary) {
        AISummary = aISummary;
    }

    public Integer getHealth() {
        return Health;
    }

    public void setHealth(Integer health) {
        Health = health;
    }

    public Mechanic getMechanic() {
        return mechanic;
    }

    public void setMechanic(Mechanic mechanic) {
        this.mechanic = mechanic;
    }




}